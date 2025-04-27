export type Shooting = {
    attributes: {
        OBJECTID: number;
        Incident_Num: string;
        Shooting_Date: number;
        District: string;
        Shooting_Type_V2: string;
        Victim_Gender: string;
        Victim_Race: string;
        Victim_Ethnicity_NIBRS: string;
        Multi_Victim: number;
        IsPrimaryIncident: number;
        HOUR_OF_DAY: number;
        DAY_OF_WEEK: string;
        YEAR: number;
        QUARTER: number;
        MONTH: number;
        NEIGHBORHOOD: string;
    }
}