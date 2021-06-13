import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './loadingComponents';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

// NOTE: Use npm start to run this client app

function App() {
  const {activityStore} = useStore();


  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

  return (
    // Implicit Fragment block
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard />
      </Container>
    </>
  );
}

export default observer(App);
