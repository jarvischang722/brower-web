export default {
  hello: 'Welcome, %{name}',
  from: 'from',
  to: 'to',
  none: 'none',
  undefined: 'unconfigured',
  remark: 'remark',
  nodata: 'No data found',
  auth: {
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    change_password: 'Change password',
    old_password: 'Current password',
    new_password: 'New password',
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
    title: 'Actions',
    add: 'Add',
    edit: 'Edit',
    remove: 'Remove',
    abort: 'Abort',
    search: 'Search',
    confirm: 'Confirm',
    cancel: 'Cancel',
    reset: 'Reset',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    detail: 'Detail',
    close: 'Close',
    copy: 'Copy',
    copied: 'Copied',
    load: 'Load',
    reload: 'Reload',
    loading: 'Loading...',
    loaded: 'Loaded',
    uploading: 'Uploading...',
    uploaded: 'Uploaded',
    sync: 'Sync',
    syncing: 'Syncing...',
    synced: 'Synced',
    commit: 'Commit',
    committing: 'Cimmitting...',
    get_all: 'Get all',
    modify: 'Modify',
    manage: 'Manage',
    export: 'Export',
    export_csv: 'Export CSV',
    generate: 'Generate',
    generating: 'Generating...',
    generated: 'Generated',
    download: 'Download',
    update: 'Update'
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
      },
      delete: {
        confirm: 'Are you sure remove the agent [ %{username} ] ?'
      }
    }
  },
  account: {
    title: 'Account',
    profile: 'Profile'
  },
  profile: {
    title: 'Profile',
    name: 'Name',
    role: 'Role',
    expire_in: 'Expire in',
    icon: 'Icon',
    icon_macos: 'Icon for macOS',
    home_url: 'Home URLs',
    copy_new_profile_information: 'Please copy the login information and send to %{role}',
    enable_vpn: 'Enable Vpn',
    ss_domain: 'SS Domain',
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
    title: 'Browser',
    settings: 'Settings',
    browsers: 'Browsers',
    link: 'Link',
    version: 'Version',
    generation_failed: 'Last generation failed!',
    generate_browser_confirm: 'Confirm',
    generate_browser_confirm_description: 'You will generate a new %{platform} Browser.',
    message: {
      windows_generation_success: 'Windows browser generated successully!',
      version_add_success: '%{platform} browser version updated!'
    }
  },
  short_link: {
    title: 'Short links',
    name: 'Short link',
    site_name: 'Site name',
    long: 'Long',
    short: 'Short',
    logo: 'Logo'
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
