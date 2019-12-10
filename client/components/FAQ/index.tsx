import { useQuery } from '@apollo/react-hooks';
import { getId } from '@uifabric/utilities';
import { getValueTyped as value } from 'helpers';
import { Shimmer } from 'office-ui-fabric-react/lib/Shimmer';
import * as React from 'react';
import { GET_FAQ } from './GET_FAQ';
import { Question } from './Question';

/**
 * @component FAQ
 * @description 
 */
export const FAQ = () => {
    const { loading, data } = useQuery(GET_FAQ, { fetchPolicy: 'cache-first' });
    const id = getId('faq');


    const questions = value(data, 'faq', []).map(q => ({
        ...q,
        id: getId('faq-question'),
    }));

    if (loading) {
        return (
            <>
                <Shimmer />
                <Shimmer />
                <Shimmer />
                <Shimmer />
            </>
        );
    }

    return (
        <div className="panel-group" id={id}>
            {questions.map(q => <Question {...q} key={q.id} parent={id} />)}
        </div>
    );
}