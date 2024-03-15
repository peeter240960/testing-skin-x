import {
  DirectiveNode,
  FieldNode,
  FragmentDefinitionNode,
  GraphQLResolveInfo,
  ValueNode,
} from 'graphql';

const options = {
  processArguments: false,
  excludedFields: [],
};
function getSelections(ast: FieldNode) {
  if (
    ast &&
    ast.selectionSet &&
    ast.selectionSet.selections &&
    ast.selectionSet.selections.length
  ) {
    return ast.selectionSet.selections;
  }

  return [];
}

function isFragment(ast: { kind: string }) {
  return ast.kind === 'InlineFragment' || ast.kind === 'FragmentSpread';
}

function getAST(
  ast: FieldNode | FragmentDefinitionNode,
  info: GraphQLResolveInfo
): FieldNode {
  if ((ast.kind as string) === 'FragmentSpread') {
    const fragmentName = ast.name.value;
    return info.fragments[fragmentName] as unknown as FieldNode;
  }

  return ast as FieldNode;
}

function getArguments(ast: FieldNode, info: GraphQLResolveInfo) {
  return ast.arguments.map((argument) => {
    const argumentValue = getArgumentValue(argument.value, info);

    return {
      [argument.name.value]: {
        kind: argument.value.kind,
        value: argumentValue,
      },
    };
  });
}

function getArgumentValue(arg: ValueNode, info: GraphQLResolveInfo) {
  switch (arg.kind) {
    case 'FloatValue':
      return parseFloat(arg.value);
    case 'IntValue':
      return parseInt(arg.value, 10);
    case 'Variable':
      return info.variableValues[arg.name.value];
    case 'ListValue':
      return arg.values.map((argument) => getArgumentValue(argument, info));
    case 'ObjectValue':
      return arg.fields.reduce((argValue, objectField) => {
        argValue[objectField.name.value] = getArgumentValue(
          objectField.value,
          info
        );
        return argValue;
      }, {});
    default:
      return (arg as { value: unknown }).value;
  }
}

function getDirectiveValue(directive: DirectiveNode, info: GraphQLResolveInfo) {
  const arg = directive.arguments[0]; // only arg on an include or skip directive is "if"
  if (arg.value.kind !== 'Variable') {
    return !!(arg.value as { value: unknown }).value;
  }
  return info.variableValues[arg.value.name.value];
}

function getDirectiveResults(ast: FieldNode, info: GraphQLResolveInfo) {
  const directiveResult = {
    shouldInclude: true,
    shouldSkip: false,
  };
  return ast.directives.reduce((result, directive) => {
    switch (directive.name.value) {
      case 'include':
        return { ...result, shouldInclude: getDirectiveValue(directive, info) };
      case 'skip':
        return { ...result, shouldSkip: getDirectiveValue(directive, info) };
      default:
        return result;
    }
  }, directiveResult);
}

function flattenAST(
  ast: GraphQLResolveInfo['fieldNodes'][number],
  info: GraphQLResolveInfo,
  obj = {}
) {
  return getSelections(ast).reduce((flattened, a: FieldNode) => {
    if (a.directives && a.directives.length) {
      const { shouldInclude, shouldSkip } = getDirectiveResults(a, info);
      // field/fragment is not included if either the @skip condition is true or the @include condition is false
      // https://facebook.github.io/graphql/draft/#sec--include
      if (shouldSkip || !shouldInclude) {
        return flattened;
      }
    }
    if (isFragment(a)) {
      flattened = flattenAST(getAST(a, info), info, flattened);
    } else {
      const name = a.name.value;
      if (options.excludedFields.indexOf(name) !== -1) {
        return flattened;
      }
      if (flattened[name] && flattened[name] !== '__arguments') {
        Object.assign(flattened[name], flattenAST(a, info, flattened[name]));
      } else {
        flattened[name] = flattenAST(a, info);
      }
      if (options.processArguments) {
        // check if the current field has arguments
        if (a.arguments && a.arguments.length) {
          Object.assign(flattened[name], {
            __arguments: getArguments(a, info),
          });
        }
      }
    }

    return flattened;
  }, obj);
}

export function graphqlFields(
  info: GraphQLResolveInfo,
  obj = {},
  opts = { processArguments: false, excludedFields: [] }
) {
  options.processArguments = opts.processArguments;
  options.excludedFields = opts.excludedFields || [];
  return (
    info.fieldNodes.reduce((o, ast) => {
      return flattenAST(ast, info, o);
    }, obj) || {}
  );
}
