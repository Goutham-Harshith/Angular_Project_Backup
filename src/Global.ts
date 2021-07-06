import { environment } from './environments/environment';

export class Global {
    //Base Paths
    public static BASE_PATH = environment.baseUrl;
    public static BASE_PATH_INGESTION = Global.BASE_PATH + "/dap-app-ingestion";
    public static BASE_PATH_TRANSFORM = Global.BASE_PATH + "/dap-app-transform";
    public static DATA_ACCESS_BASE_URL = Global.BASE_PATH + "dap-app-dataAccess";
    public static BASE_PATH_VIZ = Global.BASE_PATH + "/dap-app-visualization";
    public static BASE_PATH_VIZ_FW = Global.BASE_PATH + "/dap-app-viz-framework";
    public static BASE_PATH_ADMIN = Global.BASE_PATH + "/dap-app-admin";
    public static BASE_PATH_VERSION_CTRL = Global.BASE_PATH + "/dap-app-versionctrl";
    public static ELS_BASE_PATH = environment.elsServer;

    //Login URLS
    // public static LOGIN_URL = Global.BASE_PATH + "/login";
    // public static USERID_URL = Global.BASE_PATH+ "/fetchUid"
    public static TOKEN_URL = environment.authServer + "/oauth/token";
    public static USER_GROUP_URL = environment.authServer + "/validateUser";
    public static CHANGE_PWD_URL = Global.BASE_PATH_ADMIN + "/changeDetails";
    public static USER_STATUS_URL = Global.BASE_PATH_ADMIN + "/getUserStatus";

   //Ingestion URLS
    public static JOBS_LIST_URL = Global.BASE_PATH_INGESTION + "/jobList2";
    public static GET_SOURCES_URL = Global.BASE_PATH_INGESTION + "/sourcesDashboard";
    public static DATA_TYPE_FINDER = Global.BASE_PATH_INGESTION + "/fileDataTypesFinder";
    public static VALIDATE_PROJECT = Global.BASE_PATH_INGESTION + "/jobNameExists";
    public static VALIDATE_TABLE = Global.BASE_PATH_INGESTION + "/validateTable";
    public static CREATE_CSV_JOB_URL = Global.BASE_PATH_INGESTION + "/uploadFile";
    public static JOBS_CREATE_URL = Global.BASE_PATH_INGESTION + "/jobCreation";
    public static FILE_PREVIEW_URL = Global.BASE_PATH_INGESTION + "/FilePreviewController";
    public static TABLES_LIST_URL = Global.BASE_PATH_INGESTION + "/dbTablesList";
    public static SCHEMAS_LIST_URL = Global.BASE_PATH_INGESTION + "/dbSchemas";
    public static COLUMNS_LIST_URL = Global.BASE_PATH_INGESTION + "/columnsList";
    public static LARGE_FILE_LIST = Global.BASE_PATH_INGESTION + "/listFiles";
    public static COPY_HDFS_URL = Global.BASE_PATH_INGESTION + "/ingestLargeFiles";
    public static DEPLOY_URL = Global.BASE_PATH_INGESTION + "/jobDeploy";
    public static EXECUTE_URL = Global.BASE_PATH_INGESTION + "/jobExecute";
    public static IncrimentalColumns_URL = Global.BASE_PATH_INGESTION + "/IncrimentalColumns";
    public static RERUN_URL = Global.BASE_PATH_INGESTION + "/Rerun";
    public static OZIE_LOGS = Global.BASE_PATH_INGESTION + "/getOozieLog";
    public static GET_JOB_LOGS = Global.BASE_PATH_INGESTION + "/getJoblogs";
    public static GET_JOB_STATUS_COUNT = Global.BASE_PATH_INGESTION + "/jobExStatusCount";
    public static GET_JOB_STATUS = Global.BASE_PATH_INGESTION + "/getJobStatus";
    public static SAVE_RERUN_PARAMS = Global.BASE_PATH_INGESTION + "/saveRerunParams";
    public static SUSPEND_SCHEDULE = Global.BASE_PATH_INGESTION + "/suspendSchedule";
    public static RESUME_SCHEDULE = Global.BASE_PATH_INGESTION + "/resumeSchedule";
    public static DELETE_SCHEDULE = Global.BASE_PATH_INGESTION + "/deleteSchedule";
    public static RDBMS_SAVE_RERUN_PARAMS = Global.BASE_PATH_INGESTION + "/saveRerunParams";
    public static FETCH_SAVED_COLUMNS = Global.BASE_PATH_INGESTION + "/fetchSavedColumns";
    public static VALIDATE_SCHEDULER_NAME = Global.BASE_PATH_INGESTION + "/validateSchedulename";
    public static JOB_CREATION_USING_FILE_UPLOAD = Global.BASE_PATH_INGESTION + "/jobCreationUsingExcel";
    public static FETCH_TIMELINE = Global.BASE_PATH_INGESTION + "/fetchTimeline";

    //Transform URLS
    public static FETCH_LINEAGE_JSON_URL=Global.BASE_PATH_TRANSFORM + "/fetchLineageJson";
    public static METADATA_URL=Global.BASE_PATH_TRANSFORM + "/metaData";
    public static PREVIEW_URL= Global.BASE_PATH_TRANSFORM + "/preview";

    public static FIND_AND_REPLACE_END_POINT = Global.BASE_PATH_TRANSFORM + "/findAndReplace";
    public static DATE_AND_FILTER_END_POINT = Global.BASE_PATH_TRANSFORM + "/dateFilter";
    public static CONCAT_COLUMNS_END_POINT = Global.BASE_PATH_TRANSFORM + "/concatColumns";
    public static NUMBER_FILTER_END_POINT = Global.BASE_PATH_TRANSFORM + "/numberFilter";
    public static FOLDER_PREVIEW_END_POINT = Global.BASE_PATH_TRANSFORM + "/folderPreview";
    public static FILE_PREVIEW_END_POINT = Global.BASE_PATH_TRANSFORM + "/filePreview";
    public static FETCH_NODE_DETAILS = Global.BASE_PATH_TRANSFORM + "/fetchNodeDetailsForFlow";
    public static DELETE_GIT_FILES = Global.BASE_PATH_VERSION_CTRL + "/gitDeleteFile";
    public static EDIT_GIT_FILES = Global.BASE_PATH_VERSION_CTRL + "/gitRenameFile";

    
    //Schdeuler URLS
    public static COORD_LIST_URL = Global.BASE_PATH_INGESTION + "/getScheduledJobs";
    public static SCHEDULER = Global.BASE_PATH_INGESTION + "/schedule";
    public static OOZIEOPTIONS = Global.BASE_PATH_INGESTION + "/oozieJobOptions";
 
    //Data access URLS
    
    //Visualization URLS
    public static VIZ_TBL_LIST = Global.BASE_PATH_VIZ + "/fetchUserTables";
    public static VIZ_COL_LIST = Global.BASE_PATH_VIZ + "/stagingColumns";
    public static VIZ_CHARTS = Global.BASE_PATH_VIZ + "/fetchVizChart";
    public static JOBS_FLOW_URL = Global.BASE_PATH_VIZ + "/fetchFlowForUser";
    public static ICE_COL_LIST = Global.BASE_PATH_VIZ + "/IndirectmaterialList";
    public static ICE_DATA_JSON = Global.BASE_PATH_VIZ + "/IndirectmaterialDataJson";
    public static ICE_CLASS = Global.BASE_PATH_VIZ + "/IndirectmaterialClass";
    public static ICE_FAMILY = Global.BASE_PATH_VIZ + "/IndirectmaterialFamily";
    public static ICE_SEGMENT = Global.BASE_PATH_VIZ + "/IndirectmaterialSegment";
    public static ICE_TBL_DATA = Global.BASE_PATH_VIZ + "/IndirectmaterialTblData";
    public static SET_UNSPC_TITLE = Global.BASE_PATH_VIZ + "/WritebackSelectedUnspcTitle";

    //Admin URLS
    public static LIST_USER_URL = Global.BASE_PATH_ADMIN + "/listUsers";
    public static CREATE_USER_URL = Global.BASE_PATH_ADMIN + "/createLdapUser";
    public static SEARCH_USER_URL = Global.BASE_PATH_ADMIN + "/searchLdapForDn";
    public static DELETE_USER_URL = Global.BASE_PATH_ADMIN + "/removeUser";
    public static RESET_PASSWORD_URL = Global.BASE_PATH_ADMIN + "/resetPassword";


    //ADAS access URLs
    public static ELS_META = Global.ELS_BASE_PATH + "/getSourceMapEls";
    public static ELS_SEARCH_QUERY = Global.ELS_BASE_PATH + "/search";
}