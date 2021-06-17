import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agents";
import { Activity } from "../Models/activity";

export default class ActivityStore {
    activitiesRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activitiesRegistry.values()).sort((a1, a2) => 
        Date.parse(a1.date) - Date.parse(a2.date));
    }

    get groupedActivites() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date;
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity => {
                this.setActivity(activity);
            })  
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) 
        {
            this.selectedActivity = activity;
            return activity;
        } 
        else 
        {
            this.loadingInitial = true;
            try 
            {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.setSelectedActivity(activity);
                this.setLoadingInitial(false)
                return activity;
            } 
            catch (error) 
            {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activitiesRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activitiesRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    setSelectedActivity = (activity: Activity) => {
        this.selectedActivity = activity;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try{
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error){
            console.log(error);
            runInAction(() => {
                this.editMode = false;
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try{
            await agent.Activities.update(activity);
            runInAction(()=>{
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error){
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activitiesRegistry.delete(id);
                this.loading = false;
            })
        } catch(error){
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}