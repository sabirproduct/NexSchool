import { ExamModuleView } from '../components/ExamModuleView';
import { GPAChart } from '../components/GPAChart';
import { ReportCardGenerator } from '../components/ReportCardGenerator';

export function ExaminationManagementPage() {
  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="mb-3">
          <h2 className="h4 fw-bold">Examination & Result Management</h2>
        </div>
      </div>
      <div className="col-12">
        <GPAChart data={[{ exam: 'UT1', gpa: 7.4 }, { exam: 'Quarterly', gpa: 8.1 }, { exam: 'Half Yearly', gpa: 8.5 }]} />
      </div>
      <div className="col-12">
        <ExamModuleView />
      </div>
      <div className="col-12">
        <ReportCardGenerator />
      </div>
    </div>
  );
}
