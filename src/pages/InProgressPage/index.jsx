import './styles.css'
import Wrapper from '../../components/Wrapper';
import MatchCard from '../../components/MatchCard';
import { useEffect, useState } from 'react';

const InProgressPage = (props) => {

    const {setPlayerList, matchList, setMatchList} = props;

    

    return (
        <div className='InProgressPage'>
            <Wrapper
                title="In Progress"
                children={
                    <div className='Wrapper-div'>
                        {matchList && matchList.map((match, index)=>
                            <MatchCard 
                                key={index} 
                                match={match} 
                                matchList={matchList}
                                setMatchList={setMatchList}
                                setPlayerList={setPlayerList}/>
                        )}
                    </div>
                }/>
        </div>
    )
}; export default InProgressPage;