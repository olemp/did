
import gql from 'graphql-tag';

export default gql`
query {
  weeks {
    id
    closed
  }
  users {
    id
    fullName
    role
  }
}
`;
