import React, { useEffect, useState } from 'react';
import { getContracts } from '../../services/api';

function CustomerAccount() {
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    getContracts()
      .then((response) => setContracts(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <h1 className="my-4">My Account</h1>
      <h3>My Events</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Contract Code</th>
            <th>Event Type</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract._id}>
              <td>{contract.contractCode}</td>
              <td>{contract.eventTypeId.name}</td>
              <td>{new Date(contract.eventDate).toLocaleDateString()}</td>
              <td>{contract.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerAccount;