
import gql from 'graphql-tag';

export const GET_CUSTOMERS = gql`
{
    customers: getCustomers {
        id
        key
        name
        description
        webLink
    }
}`;
