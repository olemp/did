
import gql from 'graphql-tag';

export const GET_CUSTOMERS = gql`
{
    customers: getCustomers {
        key,
        customerKey,
        name,
        description,
        webLink
    }
}`;
