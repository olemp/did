
import gql from 'graphql-tag';

export const GET_CUSTOMERS = gql`
{
    customers {
        key,
        customerKey,
        name,
        description,
        webLink
    }
}`;
