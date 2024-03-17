import { Chip, ChipOwnProps } from '@mui/material';
import { Tag } from '../../graphql/generated';
import _ from 'lodash';

type Props = ChipOwnProps & {
  topic: Tag;
  onClick?: () => void;
};
export default function TagChipItem(props: Props) {
  return <Chip {..._.omit(props, 'topic')} label={props.topic.name} />;
}
