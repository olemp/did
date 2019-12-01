
import gql from 'graphql-tag';

export default gql`
mutation ($weekNumber: Int!, $closed: Boolean!) {
  closed: updateWeek(weekNumber: $weekNumber, closed: $closed)
}
`;
