
import gql from 'graphql-tag';

export const GET_FAQ = gql`
{
    faq {
        question
        answer
    }
}`;
