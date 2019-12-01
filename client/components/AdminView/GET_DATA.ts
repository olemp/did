
import gql from 'graphql-tag';

export default gql`
query {
  weeks: getWeeks {
    id
    closed
  }
  users: getUsers {
    id
    fullName
    role
  }
}
`;
