
if exists (select 1
            from  sysobjects
           where  id = object_id('extenduser')
            and   type = 'U')
   drop table extenduser
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('feedbacks')
            and   name  = 'i_status'
            and   indid > 0
            and   indid < 255)
   drop index feedbacks.i_status
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('feedbacks')
            and   name  = 'i_app'
            and   indid > 0
            and   indid < 255)
   drop index feedbacks.i_app
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('feedbacks')
            and   name  = 'i_type'
            and   indid > 0
            and   indid < 255)
   drop index feedbacks.i_type
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('feedbacks')
            and   name  = 'i_date'
            and   indid > 0
            and   indid < 255)
   drop index feedbacks.i_date
go

if exists (select 1
            from  sysobjects
           where  id = object_id('feedbacks')
            and   type = 'U')
   drop table feedbacks
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('logs')
            and   name  = 'i_closed'
            and   indid > 0
            and   indid < 255)
   drop index logs.i_closed
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('logs')
            and   name  = 'i_type'
            and   indid > 0
            and   indid < 255)
   drop index logs.i_type
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('logs')
            and   name  = 'i_hash'
            and   indid > 0
            and   indid < 255)
   drop index logs.i_hash
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('logs')
            and   name  = 'i_app'
            and   indid > 0
            and   indid < 255)
   drop index logs.i_app
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('logs')
            and   name  = 'i_date'
            and   indid > 0
            and   indid < 255)
   drop index logs.i_date
go

if exists (select 1
            from  sysobjects
           where  id = object_id('logs')
            and   type = 'U')
   drop table logs
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('userping')
            and   name  = 'i_app'
            and   indid > 0
            and   indid < 255)
   drop index userping.i_app
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('userping')
            and   name  = 'i_date'
            and   indid > 0
            and   indid < 255)
   drop index userping.i_date
go

if exists (select 1
            from  sysobjects
           where  id = object_id('userping')
            and   type = 'U')
   drop table userping
go

/*==============================================================*/
/* Table : extenduser                                           */
/*==============================================================*/
create table extenduser (
   userid               uniqueidentifier     not null,
   "key"                varchar(64)          not null,
   value                nvarchar(512)        not null,
   constraint pk_extenduser primary key (userid, "key")
)
go

declare @currentuser sysname
select @currentuser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   'User Extension Table of ASP.Net Identity Model',
   'user', @currentuser, 'table', 'extenduser'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Id comes from ASP.Net identity model, convert in GUID for Shitsuke',
   'user', @currentuser, 'table', 'extenduser', 'column', 'userid'
go

/*==============================================================*/
/* Table : feedbacks                                            */
/*==============================================================*/
create table feedbacks (
   id                   bigint               identity,
   applicationid        char(8)              not null,
   utctimestamp         datetime             not null default getdate(),
   type                 tinyint              not null default 0,
   status               tinyint              not null default 0,
   comments             nvarchar(2048)       not null,
   userid               nvarchar(128)        not null,
   pageid               varchar(128)         null,
   browserinfo          varchar(1024)        null,
   screenshot           image                null,
   constraint pk_feedbacks primary key (id)
)
go

declare @currentuser sysname
select @currentuser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   'Feedbacks created by users',
   'user', @currentuser, 'table', 'feedbacks'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Created Date (UTC)',
   'user', @currentuser, 'table', 'feedbacks', 'column', 'utctimestamp'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Feedback Type : Bug, Feedback, Question...',
   'user', @currentuser, 'table', 'feedbacks', 'column', 'type'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Current status of feedback : new, open..',
   'user', @currentuser, 'table', 'feedbacks', 'column', 'status'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Feedback written by user',
   'user', @currentuser, 'table', 'feedbacks', 'column', 'comments'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Json Object contains some info on browser',
   'user', @currentuser, 'table', 'feedbacks', 'column', 'browserinfo'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Screenshot take by user (convert from Base64 image)',
   'user', @currentuser, 'table', 'feedbacks', 'column', 'screenshot'
go

/*==============================================================*/
/* Index : i_date                                               */
/*==============================================================*/
create index i_date on feedbacks (
utctimestamp asc
)
go

/*==============================================================*/
/* Index : i_type                                               */
/*==============================================================*/
create index i_type on feedbacks (
type asc
)
go

/*==============================================================*/
/* Index : i_app                                                */
/*==============================================================*/
create index i_app on feedbacks (
applicationid asc
)
go

/*==============================================================*/
/* Index : i_status                                             */
/*==============================================================*/
create index i_status on feedbacks (
status asc
)
go

/*==============================================================*/
/* Table : logs                                                 */
/*==============================================================*/
create table logs (
   id                   bigint               identity,
   applicationid        char(8)              not null,
   isclosed             bit                  not null default 0,
   machinename          varchar(64)          not null,
   creationdate         datetime             not null,
   type                 varchar(128)         not null,
   errorlevel           tinyint              not null default 0,
   statuscode           int                  null,
   errorhash            int                  null,
   host                 varchar(128)         null,
   url                  varchar(512)         null,
   httpmethod           varchar(8)           null,
   ipaddress            varchar(64)          null,
   source               nvarchar(128)        null,
   message              nvarchar(1024)       null,
   detail               nvarchar(max)        null,
   sql                  nvarchar(max)        null,
   fulljson             nvarchar(max)        null,
   constraint pk_logs primary key (id)
)
go

declare @currentuser sysname
select @currentuser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   'Event logs created by applications ',
   'user', @currentuser, 'table', 'logs'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'True if this Logs launch an corrective action (eg : create a bug based on)',
   'user', @currentuser, 'table', 'logs', 'column', 'isclosed'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Http Status Code',
   'user', @currentuser, 'table', 'logs', 'column', 'statuscode'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Hashcode of the error, use for group faster duplicate logs',
   'user', @currentuser, 'table', 'logs', 'column', 'errorhash'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Source code of logs',
   'user', @currentuser, 'table', 'logs', 'column', 'source'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'SQL Error if it exists',
   'user', @currentuser, 'table', 'logs', 'column', 'sql'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Full json of logs : should be move in other table and use the new SQL 2016 json fied type',
   'user', @currentuser, 'table', 'logs', 'column', 'fulljson'
go

/*==============================================================*/
/* Index : i_date                                               */
/*==============================================================*/
create index i_date on logs (
creationdate asc
)
go

/*==============================================================*/
/* Index : i_app                                                */
/*==============================================================*/
create index i_app on logs (
applicationid asc
)
go

/*==============================================================*/
/* Index : i_hash                                               */
/*==============================================================*/
create index i_hash on logs (
errorhash asc
)
go

/*==============================================================*/
/* Index : i_type                                               */
/*==============================================================*/
create index i_type on logs (
type asc
)
go

/*==============================================================*/
/* Index : i_closed                                             */
/*==============================================================*/
create index i_closed on logs (
isclosed asc
)
go

/*==============================================================*/
/* Table : userping                                             */
/*==============================================================*/
create table userping (
   id                   bigint               identity,
   applicationid        char(8)              not null,
   utctimestamp         datetime             not null,
   userid               nvarchar(128)        not null,
   pageid               varchar(128)         null,
   browerinfo           varchar(1024)        null,
   constraint pk_userping primary key nonclustered (id)
)
go

declare @currentuser sysname
select @currentuser = user_name()
execute sys.sp_addextendedproperty 'MS_Description', 
   'Ping information from users',
   'user', @currentuser, 'table', 'userping'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Application ID',
   'user', @currentuser, 'table', 'userping', 'column', 'applicationid'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'Created Date (UTC)',
   'user', @currentuser, 'table', 'userping', 'column', 'utctimestamp'
go

declare @currentuser sysname
select @currentuser = user_name()
execute sp_addextendedproperty 'MS_Description', 
   'User Id from app',
   'user', @currentuser, 'table', 'userping', 'column', 'userid'
go

/*==============================================================*/
/* Index : i_date                                               */
/*==============================================================*/
create clustered index i_date on userping (
utctimestamp asc
)
go

/*==============================================================*/
/* Index : i_app                                                */
/*==============================================================*/
create index i_app on userping (
applicationid asc
)
go

