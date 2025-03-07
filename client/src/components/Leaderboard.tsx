
type User = {
    id: string,
    name: string,
    points: number
}

const Leaderboard = ({ leaderboard }: {
    leaderboard: User[]
}) => {
    console.log("leaderboard => ", leaderboard);
    
    return (
        <div>
            <h1>Leaderboard</h1>
            {leaderboard.map((user: User, index: number) => (
                <div key={index}>
                    {index + 1}. {user.name} - Score: {user.points}
                </div>
            ))}
        </div>
    )
}

export default Leaderboard