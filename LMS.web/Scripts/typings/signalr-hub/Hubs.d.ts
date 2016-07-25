// Get signalr.d.ts.ts from https://github.com/borisyankov/DefinitelyTyped (or delete the reference)
/// <reference path="../signalr/signalr.d.ts" />

////////////////////
// available hubs //
////////////////////
//#region available hubs

interface SignalR {

    /**
      * The hub implemented by LMS.web.Hub.FeedbackHub
      */
    feedbackHub: FeedbackHub;

    /**
      * The hub implemented by LMS.web.Hub.HomeMonitorHub
      */
    homeMonitorHub: HomeMonitorHub;

    /**
      * The hub implemented by LMS.web.Hub.LogsHub
      */
    logsHub: LogsHub;

    /**
      * The hub implemented by LMS.web.Hub.MonitorHub
      */
    monitorHub: MonitorHub;
}
//#endregion available hubs

///////////////////////
// Service Contracts //
///////////////////////
//#region service contracts

//#region FeedbackHub hub

interface FeedbackHub {
    
    /**
      * This property lets you send messages to the FeedbackHub hub.
      */
    server: FeedbackHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the FeedbackHub hub.
      */
    client: any;
}

interface FeedbackHubServer {

    /** 
      * Sends a "refreshFeedBack" message to the FeedbackHub hub.
      * Contract Documentation: ---
      * @param clientModel {Object} 
      * @return {JQueryPromise of void}
      */
    refreshFeedBack(clientModel: Object): JQueryPromise<void>
}

//#endregion FeedbackHub hub


//#region service contracts

//#region HomeMonitorHub hub

interface HomeMonitorHub {
    
    /**
      * This property lets you send messages to the HomeMonitorHub hub.
      */
    server: HomeMonitorHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the HomeMonitorHub hub.
      */
    client: any;
}

interface HomeMonitorHubServer {

    /** 
      * Sends a "refreshClientCount" message to the HomeMonitorHub hub.
      * Contract Documentation: ---
      * @param clientModel {HomeMonitoringHubModel} 
      * @return {JQueryPromise of void}
      */
    refreshClientCount(clientModel: HomeMonitoringHubModel): JQueryPromise<void>;

    /** 
      * Sends a "hello" message to the HomeMonitorHub hub.
      * Contract Documentation: ---
      * @return {JQueryPromise of void}
      */
    hello(): JQueryPromise<void>;
}

//#endregion HomeMonitorHub hub


//#region LogsHub hub

interface LogsHub {
    
    /**
      * This property lets you send messages to the LogsHub hub.
      */
    server: LogsHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the LogsHub hub.
      */
    client: any;
}

interface LogsHubServer {

    /** 
      * Sends a "refresh" message to the LogsHub hub.
      * Contract Documentation: ---
      * @param clientModel {IEnumerable<LoggingHubModel>} 
      * @return {JQueryPromise of void}
      */
    refresh(clientModel: Array<LoggingHubModel>): JQueryPromise<void>;

    /** 
      * Sends a "hello" message to the LogsHub hub.
      * Contract Documentation: ---
      * @return {JQueryPromise of void}
      */
    hello(): JQueryPromise<void>;
}

//#endregion LogsHub hub


//#region MonitorHub hub

interface MonitorHub {
    
    /**
      * This property lets you send messages to the MonitorHub hub.
      */
    server: MonitorHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the MonitorHub hub.
      */
    client: any;
}

interface MonitorHubServer {

    /** 
      * Sends a "refresh" message to the MonitorHub hub.
      * Contract Documentation: ---
      * @param clientModel {IEnumerable<MonitoringHubModel>} 
      * @return {JQueryPromise of void}
      */
    refresh(clientModel: Array<MonitoringHubModel>): JQueryPromise<void>;

    /** 
      * Sends a "hello" message to the MonitorHub hub.
      * Contract Documentation: ---
      * @return {JQueryPromise of void}
      */
    hello(): JQueryPromise<void>;
}

//#endregion MonitorHub hub

//#endregion service contracts



////////////////////
// Data Contracts //
////////////////////
//#region data contracts


/**
  * Data contract for System.Collections.Generic.IEnumerable`1[[LMS.Core.Models.MonitoringHubModel, LMS.Core, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]
  */
interface MonitoringHubModel {
    Id: string,
    UsersCount: number;
    UsersCountHistory: Array<number>;
    PagesCountHistory: Array<number>;
    PagesCountHistoryBySecond: Array<number>;
}



/**
  * Data contract for System.Collections.Generic.IEnumerable`1[[LMS.Core.Models.LoggingHubModel, LMS.Core, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null]]
  */
interface LoggingHubModel {
    Id: string;
    Count: number;
    List: Array<NameValue>;
    MinutesCount: Array<number>;
    LastLogs: Array<miniLog>;
}

interface NameValue {
    Name: string;
    Value: any;
}

interface miniLog {
    Id: number;
    Type: string;
    Message: string;
    Date: string;
    App?: string;
}
/**
  * Data contract for LMS.Core.Models.HomeMonitoringHubModel
  */
interface HomeMonitoringHubModel {
    UsersCount: number;
    PagesCount: number;
    AppsCount: number;
}

//#endregion data contracts

