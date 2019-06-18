// 常量
export default {
  // 菜单宽度
  menuWidth:256,
  // 菜单主题列表
  menuThemeList:[
    {name:"light",isDefault:true},
    {name:"dark",isDefault:false}
  ],
  // 保存在store中的值的名称
  store:{
    token:"shs_token",
    userName:"shs_user_name",
    menu:"shs_menu",
    menuTheme:"shs_menu_theme",
    collapsed:"shs_collapsed",
    openKeys:"shs_open_keys"
  },
  // 保存src/models中的全局model，方便其他页面调用
  models:{
    global:{
      namespace:"global",
      effects:{
        hasToken:"hasToken",
        signOut:"signOut"
      },
      reducers: {
        updateState:"updateState",
        handleCollapseChange:"handleCollapseChange",
        handleMenuThemeChange:"handleMenuThemeChange",
      },
      api:{
      },
    }
  },
  // 枚举类型
  enums:{
    enableState:{
      '1':"启用",
      '2':"禁用"
    },
    yesOrNoState:{
      '1':"是",
      '2':"否"
    }
  },
  // 正则对象
  regExpObj:{
    phone:/^((13[0-9])|(14[0-9])|(17[0-9])|(15[^4,\D])|(18[0-9])|(19[0-9]))\d{8}$/
  }
}
