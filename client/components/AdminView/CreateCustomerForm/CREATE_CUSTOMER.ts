
import gql from 'graphql-tag';

export default gql`
    mutation($key: String!, $name: String!) { 
        result: createCustomer(key: $key, name: $name) {
            success
            error
        }
    }
`;