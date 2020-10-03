import React from 'react';
import ClusterRenderMap from './../../components/clusterMap';
import './../../css/literacyMap.css';

const Dashboard = () => (
  <div className="content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <ClusterRenderMap />
        </div>
        {/* <div className="col-md-8">
          <SalesChart />
        </div> */}
      </div>
      {/* <div className="row">
        <div className="col-md-6">
          <UserBehaviorChart />
        </div>
        <div className="col-md-6">
          <Tasks />
        </div>
      </div> */}

    </div>
  </div>
);

export default Dashboard;