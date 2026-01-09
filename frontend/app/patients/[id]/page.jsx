export default async function PatientDetailPage({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
  
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">
          Patient Details
        </h1>
  
        <p className="text-gray-600">
          Patient ID: <b>{id}</b>
        </p>
      </div>
    );
  }
  