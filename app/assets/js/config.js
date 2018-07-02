let CONFIG = {};

CONFIG.DIR_DATA = `${process.env.APPDATA.replace(/\\/g,"/")}/LoaderX`;
CONFIG.DIR_LOCAL = `${process.env.APPDATA.replace(/\\/g,"/")}/LoaderX/local`;

CONFIG.SUBDIR_AUDIO = CONFIG.DIR_LOCAL + '/audio'
CONFIG.SUBDIR_VIDEO = CONFIG.DIR_LOCAL + '/videos'
