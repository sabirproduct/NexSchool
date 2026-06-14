import { Route, Routes } from 'react-router-dom';
import { AdmissionManagementPage, AdmissionFormPage } from '../../modules/admissions/pages';

export function AdmissionsPage() {
  return (
    <Routes>
      <Route index element={<AdmissionManagementPage />} />
      <Route path="form" element={<AdmissionFormPage />} />
    </Routes>
  );
}