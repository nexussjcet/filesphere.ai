export default async function Page({ params }: { params: { id: string } }) {
  return (
    <div className="h-full w-full overflow-hidden">
      <iframe
        src={`https://drive.google.com/file/d/${params.id}/preview`}
        width="100%"
        height="100%"
        className="border-none"
      ></iframe>
    </div>
  );
}
