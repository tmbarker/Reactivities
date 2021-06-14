import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/loadingComponents';
import { useStore } from '../../../app/stores/store';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

export default observer(function ActivityDashboard() {

    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore;

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore])

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app'/>

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&// Only load the right operand if the left operand exists
                <ActivityDetails />}
                {editMode &&
                <ActivityForm />}
            </Grid.Column>
        </Grid>
    )
})