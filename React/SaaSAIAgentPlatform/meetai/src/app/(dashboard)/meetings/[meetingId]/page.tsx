interface Props {
    params: Promise<{ meetingId: string }>;
}
const Page = ({ meetingId }: Props ) => {
    // let meetingId: string;
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Meeting Page { meetingId }</h1>
            <p className="text-gray-600">This is the individual meeting page.</p>
        </div>
    );
}
export default Page;