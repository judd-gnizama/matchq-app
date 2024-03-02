import { useEffect, useState } from 'react';
import Wrapper from '../../components/Wrapper';
import './styles.css'
const QueueingPage = (props) => {

    const {playerList, setPlayerList, getDataFromQueueing, 
        sortPlayerList, playerKey, matchKey, setMatchList} = props;
    const [newPlayer, setNewPlayer] = useState("");
    const [playersForQueue, setPlayersForQueue] = useState([]);

    const handleAddPlayer = (event) => {
        event.preventDefault();
        const inList = playerList.some(player => player.name.toUpperCase() === newPlayer.toUpperCase());
        if (newPlayer) {
            if (!inList) {
                setPlayerList(prevList=>[...prevList, {
                    name: newPlayer, 
                    gamesPlayed: 0,
                    lastGame: "N/A", 
                    wins: 0,
                    losses: 0, 
                    currentTeam: "N/A",   // N/A , Team 1, Team 2
                    playerStatus: "idle", // idle, in-game
                    toBeReleased: false
                }])
                setNewPlayer("")
                // sortPlayerList(playerList)
                
            } else {
                console.log("Already in List")
            }
        }
    }

    const handleRemove = (_name) => {
        if (playerList.length === 1) {
            localStorage.setItem(playerKey, [])
            localStorage.setItem(matchKey, [])
            setPlayerList([])
            setMatchList([])
            
        }
        setPlayerList(prevList => prevList.filter(player => player.name !== _name))
    }

    const handleDropdownChange = (event) => {
        setPlayerList(prevList => 
            prevList.map((player) => {
                if(player.name === event.target.name) {
                    return {...player, currentTeam: event.target.value};
                }
                return player;
            }
        ))
    }

    const handleResetTeams = () => {
        setPlayerList(prevList => 
            prevList.map((player) => {
                if (player.playerStatus === "idle") {
                    return {...player, currentTeam: "N/A"}
                }
                return player;
            }
        ))
    }

    const handleQueue = () => {
        const tempTeam1List = playerList.filter(player => player.currentTeam === "Team 1" && player.playerStatus==="idle")
        const tempTeam2List = playerList.filter(player => player.currentTeam === "Team 2" && player.playerStatus==="idle")

        if (tempTeam1List && tempTeam2List && tempTeam1List.length===tempTeam2List.length) {
            if (tempTeam1List.length > 0 && tempTeam1List.length <= 2 && tempTeam2List.length > 0 && tempTeam2List.length <= 2) {
                const newGroupKey = getGroupKey();
                setPlayersForQueue(
                    {   groupKey: newGroupKey, 
                        team1: tempTeam1List, 
                        team2: tempTeam2List, 
                        matchStatus: 0, // 0 progress, 1 done, -1 cancelled
                        winners: [],
                        losers: []
                    });
                setPlayerList(prevList => 
                    prevList.map((player)=> {
                        if(player.currentTeam !== "N/A") {
                            player.playerStatus = "in-game";
                        }
                        return player;
                    }))

            } else {
                console.log("Player Number exceed 2")
            }
        } else {
            console.log("Unbalanced teams")
        }
    }

    const getGroupKey = () => Date.now();

    useEffect(() => {
        if (playersForQueue.team1 && playersForQueue.team2) {
            getDataFromQueueing(playersForQueue)
        }
    }, [playersForQueue])

    return (
        <div className="QueueingPage">
            <Wrapper 
                title="Players"
                children={
                    <div className='Wrapped-Queueing'>
                        <div>
                            <form>
                                <input 
                                    type="text" 
                                    placeholder='Enter Player Name'
                                    value={newPlayer}
                                    onChange={(event)=> {setNewPlayer(event.target.value)}} />
                                <button
                                    type="submit"
                                    onClick={handleAddPlayer}>Add</button>
                            </form>
                            <div className='buttonGroup'>
                                <button 
                                type="reset"
                                onClick={handleResetTeams}>Reset</button>
                                <button onClick={handleQueue}>Queue</button>
                            </div>
                        </div>

                        <table className={playerList.length > 0 ? 'enabled' : 'hidden'}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th># Games</th>
                                    <th>Last Played</th>
                                    <th>Standing</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {playerList && playerList.map((player, index) => (
                                    <tr key={index} 
                                        className={
                                            player.playerStatus === 'in-game' ? "disabled" : "" // change to disabled when in-game
                                        }>
                                        <td>{player.name}</td>
                                        <td>{player.gamesPlayed}</td>
                                        <td>{player.lastGame}</td>
                                        <td>{`${player.wins}W-${player.losses}L`}</td>
                                        <td>
                                            {player.playerStatus}
                                        </td>
                                        <td>
                                            <select 
                                            name={player.name} 
                                            value={player.currentTeam} 
                                            onChange={handleDropdownChange}
                                            disabled={player.playerStatus==="in-game"} >
                                                <option value="N/A">N/A</option>
                                                <option value="Team 1">Team 1</option>
                                                <option value="Team 2">Team 2</option>
                                            </select>
                                            <box-icon 
                                                name='trash' 
                                                className='remove' 
                                                onClick={() => handleRemove(player.name)}
                                                value={player.name}
                                                disabled={player.playerStatus==="in-game"}>
                                            </box-icon>
                                        </td>
                                        
                                    </tr>
                                )
                                )}
                            </tbody>
                        </table>

                    </div>
                }/>
        </div>
    )
}; export default QueueingPage;