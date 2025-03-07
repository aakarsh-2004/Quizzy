
const Question = ({ question }: {
    question: any
}) => {
    return (
        <div>
            <h1>Question</h1>
            <p>{JSON.stringify(question)}</p>
        </div>
    )
}

export default Question