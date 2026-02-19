import { useState } from 'react';
import SummaryCards from '../components/SummaryCards';
import Charts from '../components/Charts';
import AddTransactionModal from '../components/AddTransactionModal';
import GreetingWidget from '../components/GreetingWidget';

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <GreetingWidget />
      <SummaryCards />
      <Charts />

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
