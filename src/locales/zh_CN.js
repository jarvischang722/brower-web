export default {
  hello: '你好, %{name}',
  from: '从',
  to: '到',
  none: '无',
  undefined: '未设置',
  remark: '备注',
  nodata: '无数据',
  auth: {
    login: '登录',
    logout: '退出登录',
    username: '账号',
    password: '密码',
    change_password: '修改密码',
    old_password: '当前密码',
    new_password: '新密码',
    confirm_new_password: '确认新密码',
    validation: {
      username_required: '请输入账号',
      password_required: '请输入密码',
      password_invalid_length: '密码长度不够，请输入至少%{length}位密码',
      new_password_should_not_as_same_as_old_password: '新密码不可与当前密码相同',
      old_password_required: '请输入现在的密码',
      new_password_required: '请输入新密码',
      confirm_new_password_required: '请再次输入新密码',
      confirm_new_password_not_same: '两次输入的密码不一致'
    },
    message: {
      change_initial_password_alert: '请先修改初始密码，修改后可进入系统',
      password_changed: '修改密码完成'
    }
  },
  list: {
    title: '列表',
    all: '共有%{type}记录 %{total} 条',
    filtered: '共匹配%{type}记录 %{total} 条'
  },
  message: {
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
    failed: '失败'
  },
  actions: {
    title: '操作',
    add: '添加',
    edit: '编辑',
    remove: '删除',
    abort: '废除',
    search: '搜索',
    confirm: '确认',
    cancel: '取消',
    reset: '重置',
    save: '保存',
    saving: '正在保存...',
    saved: '已保存',
    detail: '详情',
    close: '关闭',
    copy: '复制',
    copied: '已复制',
    load: '加载',
    reload: '刷新',
    loading: '加载中...',
    loaded: '已加载',
    uploading: '上传中...',
    uploaded: '已上传',
    sync: '同步',
    syncing: '同步中...',
    synced: '已同步',
    commit: '提交',
    committing: '正在提交...',
    get_all: '查看全部',
    modify: '修改',
    manage: '管理',
    export: '导出',
    export_csv: '导出 CSV',
    generate: '生成',
    generating: '正在生成...',
    generated: '已生成',
    download: '下载',
    update: '更新'
  },
  limited: '限制',
  unlimited: '不限',
  agent: {
    title: '子代理',
    name: '子代理',
    profile: '用户信息',
    filters: {
      search: '账号或名称包含'
    },
    actions: {
      reset_password: '重置密码'
    },
    validation: {
      username_required: '请输入子代理账号',
      username_alphanumeric_only: '账号仅限于字母，数字和下划线(_)组合',
      username_invalid_length: '账号长度过长，请缩短账号',
      name_required: '请输入子代理显示名称'
    },
    message: {
      success: {
        create: '子代理“%{name}”创建成功！',
        update: '子代理“%{name}”已保存！'
      }
    }
  },
  account: {
    title: '个人中心',
    profile: '个人信息'
  },
  profile: {
    title: '账号信息',
    name: '名称',
    role: '账户类型',
    expire_in: '过期时间',
    icon: '图标',
    icon_macos: 'MacOS 图标',
    home_url: '主页地址',
    enable_vpn: '啟用VPN',
    copy_new_profile_information: '请复制以下账户登录信息，并发送给%{role}',
    validation: {
      name_required: '请输入名称',
      icon_required: '请提供浏览器图标',
      icon_macOS_required: '请提供macOS浏览器图标',
      home_url_required: '请提供首页地址'
    }
  },
  role: {
    title: '账户类型',
    superadmin: '超级管理员',
    agent: '代理',
    client: '客户'
  },
  browser: {
    title: '浏览器',
    settings: '浏览器配置信息',
    browsers: '浏览器',
    link: '下载地址',
    version: '版本',
    generation_failed: '上次生成失败',
    generate_browser_confirm: '请确认',
    generate_browser_confirm_description: '确认生成一个新版本的 %{platform} 浏览器？',
    message: {
      windows_generation_success: 'Windows浏览器生成成功!',
      version_add_success: '%{platform} 浏览器版本更新!'
    }
  },
  short_link: {
    title: '短地址',
    name: '短地址',
    site_name: '网站',
    long: '长地址',
    short: '短地址',
    logo: 'LOGO'
  },
  weeks: {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
  },
  errors: {
    RequestTimeout: '请求超时',
    Unauthorized: '身份验证失败，请重新登录',
    AgentDuplicated: '子代理账号已存在',
    ChangePasswordFailed: '修改密码失败，请确认当前密码正确',
    ConnectionRefused: '连接断开，请稍后重试'
  },
  keyword: {
    title: '关键字',
    name: '关键字',
    new_tag: 'New Tag'
  },
  player: {
    title: '玩家',
    name: '玩家',
    status: 'Status',
    disabled_expire: 'Disabled expire'
  },
  black_white_list: {
    title: '黑/白名单',
    name: '黑/白名单',
    black: '黑名单',
    white: '白名单'
  }
}
