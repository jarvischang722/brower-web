export default {
  hello: 'Welcome, %{name}',
  from: 'from',
  to: 'to',
  none: 'none',
  undefined: 'unconfigured',
  remark: 'remark',
  nodata: 'No data found',
  auth: {
    login: 'login',
    logout: 'logout',
    username: 'username',
    password: 'password',
    change_password: 'change password',
    old_password: 'current password',
    new_password: 'new password',
    confirm_new_password: 'confirm new password',
    validation: {
      username_required: 'username required',
      password_required: 'password required',
      password_invalid_length: 'password length is at less %{length}',
      new_password_should_not_as_same_as_old_password:
        'password should not as same as current password',
      old_password_required: 'current password required',
      new_password_required: 'new password required',
      confirm_new_password_required: 'type new password again',
      confirm_new_password_not_same: 'confirm new passwords are different'
    },
    message: {
      change_initial_password_alert: 'place change your initial password before you enter system',
      password_changed: 'password changed'
    }
  },
  list: {
    title: 'list',
    all: 'All %{type}: %{total}',
    filtered: 'Filtered %{type}: %{total}'
  },
  message: {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
    failed: 'failed'
  },
  actions: {
    title: 'actions',
    add: 'add',
    edit: 'edit',
    remove: 'remove',
    abort: 'abort',
    search: 'search',
    confirm: 'confirm',
    cancel: 'cancel',
    reset: 'reset',
    save: 'save',
    saving: 'saving...',
    saved: 'saved',
    detail: 'detail',
    close: 'close',
    copy: 'copy',
    copied: 'copied',
    load: 'load',
    reload: 'reload',
    loading: 'loading...',
    loaded: 'loaded',
    uploading: 'uploading...',
    uploaded: 'uploaded',
    sync: 'sync',
    syncing: 'syncing...',
    synced: 'synced',
    commit: 'commit',
    committing: 'cimmitting...',
    get_all: 'get all',
    modify: 'modify',
    manage: 'manage',
    export: 'export',
    export_csv: 'export CSV',
    generate: 'generate',
    generating: 'generating...',
    generated: 'generated',
    download: 'download',
    update: 'update'
  },
  limited: 'limited',
  unlimited: 'unlimited',
  agent: {
    title: 'agents',
    name: 'agent',
    profile: 'profile',
    filters: {
      search: 'name included'
    },
    actions: {
      reset_password: 'reset password'
    },
    validation: {
      username_required: 'username required',
      username_alphanumeric_only: 'alphanumeric only',
      username_invalid_length: 'username is too long',
      name_required: 'name required'
    },
    message: {
      success: {
        create: 'create agent %{name} success!',
        update: 'upate agent %{name} success！'
      }
    }
  },
  account: {
    title: 'account',
    profile: 'profile'
  },
  profile: {
    title: 'profile',
    name: 'name',
    role: 'role',
    expire_in: 'expire in',
    icon: 'icon',
    icon_macos: 'icon for macOS',
    home_url: 'home URLs',
    copy_new_profile_information: 'Please copy the login information and send to %{role}',
    enable_vpn: 'Enable Vpn',
    validation: {
      name_required: 'name is required',
      icon_required: 'icon is required',
      icon_macOS_required: 'macOS icon is required',
      home_url_required: 'home url is required'
    }
  },
  role: {
    title: 'role',
    superadmin: 'superadmin',
    agent: 'agent',
    client: 'client'
  },
  browser: {
    title: 'browser',
    settings: 'settings',
    browsers: 'browsers',
    link: 'link',
    version: 'version',
    generation_failed: 'Last generation failed!',
    generate_browser_confirm: 'Confirm',
    generate_browser_confirm_description: 'You will generate a new %{platform} Browser.',
    message: {
      windows_generation_success: 'Windows browser generated successully!',
      version_add_success: '%{platform} browser version updated!'
    }
  },
  short_link: {
    title: 'short links',
    name: 'short link',
    site_name: 'site name',
    long: 'long',
    short: 'short',
    logo: 'logo'
  },
  weeks: {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  },
  errors: {
    RequestTimeout: 'request timeout',
    Unauthorized: 'unauthorized',
    AgentDuplicated: 'Agent duplicated',
    ChangePasswordFailed: 'change password failed, please confirm your current password',
    ConnectionRefused: 'Connection refused. Please try again later'
  },
  keyword: {
    title: 'keywords',
    name: 'keyword',
    new_tag: 'New Tag'
  },
  player: {
    title: 'player',
    name: 'player',
    status: 'Status',
    disabled_expire: 'Disabled expire'
  },
  black_white_list: {
    title: 'black/white list',
    name: 'black/white list',
    black: 'Black List',
    white: 'White List'
  }
}
