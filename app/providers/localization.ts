import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Injectable()
export class Localization {
    langCode = 'en';

    setLang(lang) {
        let lowerLang = lang.toLowerCase();
        let l = lowerLang.split('-')[0];
        if (lowerLang != 'zh-tw' && 'zh' == l)
            this.langCode = 'zh';
        else 
            this.langCode = 'en';
        console.log('lang', lang, l, this.langCode);
    }


    getString(id) {
        let s = this.translation[this.langCode][id];
        return s ? s : id;
    }

    translation = {
        en: {
            Description: 'Description',
            West: 'West',
            East: 'East',
            Central: 'Central',
            North: 'North',
            South: 'South',
            Book: 'Book',
            Team: 'Team',
            Teams: 'Teams',
            MyTeam: 'My Team',
            CreateTeam: 'Create New Team',
            NoTeamPrompt: 'You have not joined a team',
            JoinTeam: 'Join a Team',
            Home: 'Home',
            Settings: 'Settings',
            ChatRoom: 'Chats',
            Create: 'Create',
            CreateAccount: 'CreateAccount',
            Quit: 'Quit',
            players: 'players',
            Players: 'Players',
            PromoteToCaptain: 'Promote to captain',
            Date: 'Date',
            Time: 'Time',
            Opponent: 'Opponent',
            Location: 'Location',
            JerseyColor: 'Jersey color',
            Details: 'Detials',
            Post: 'Post',
            Cancel: 'Cancel',
            MatchNotice: 'Match Notice',
            MyProfile: 'My Profile',
            Height: 'Height',
            Weight: 'Weight',
            Foot: 'Foot',
            left: 'Left',
            right: 'Right',
            RightFoot: 'Right Foot',
            LeftFoot: 'Left Foot',
            Position: 'Position',
            GK: 'GK',
            CB: 'CB',
            SB: 'SB',
            DMF: 'DMF',
            AMF: 'AMF',
            CF: 'CF',
            SF: 'SF',
            Feedback: 'Feedback',
            Submit: 'Submit',
            Logout: 'Logout',
            PleaseLogin: 'Please Login',
            Login: 'Login',
            Createteamsuccessfully: 'Create team successfully',
            Youcannotquitdefaultteam: 'You can not quit default team',
            Captaincannotquit: 'Captain can not quit',
            Thanksforyourfeedback: 'Thanks for your feedback',
            Captain: 'Captain',
            Default: 'Default',
            Teamexists: 'Team exists',
            Send: 'Send',
            inviteyoutojoin: 'invite you to join',
            Scores: 'Scores',
            Score: 'Score',
            League: 'League (Comming Soon)',
            Nextmatch: 'Next match',
            Going: 'Going',
            Cannotgo: 'Can not go',
            Typeyourmessage: 'Type your message',
            Redcard: 'Red card',
            Yellowcard: 'Yellow card',
            Rank : 'Rank',
            Message: 'Message',
            Played: 'Played',
            Matches: 'Matches',
            Popularity: 'Popularity',
            MyPage: 'My Page',
            Notifications: 'Notifications',
            UpcomingMatches: 'Upcoming Match',
            Today: 'Today',
            Tomorrow: 'Tomorrow',
            Yesterday: 'Yesterday',
            MatchDetail: 'Match Detail',
            EditPlayer: 'Edit Player',
            Photo: 'Photo',
            Nickname: 'Nick Name',
            HeightCM: 'Height (CM)',
            WeightKG: 'Weight (KG)',
            Save: 'Save',
            TeamName: 'Team Name',
            ConnectWithFacebook: 'Connect with Facebook',
            UsingSBAccount: 'Or via SoccerBro account',
            ResetPwd: 'Reset Password',
            ManagePlayers: 'Manage Players',
            ManageTeams: 'Manage Teams',
            Me: 'Me',
            PlayerInfo: 'Player Info',
            Ability: 'Ability',
            TeamInfo: 'Team Info',
            NewMatch: 'New Match',
            Notice: 'Notice',
            ResetMsg: 'Check your email to reset password.',
            InviteMsg: 'Team invitation link is copied to clipboard.',
            Withdraw: 'Withdraw',
            WithdrawMatch: 'Withdraw this match?',
            FeedbackMsg: 'Thanks for your feedback!',
            speed: 'speed',
            power: 'power',
            stamina: 'stamina',
            pass: 'pass',
            attack: 'attack',
            defence: 'defence',
            Email: 'Email',
            Password: 'Password',
            ViewAll: 'View All',
            EditTeam: 'Edit Team',
            Logo: 'Logo',
            SoccerBro: 'SoccerBro',
            OK: 'OK',
        },

        zh: {
            Description: '简介',
            West: '西部',
            East: '东部',
            Central: '中部',
            North: '北部',
            South: '南部',
            Book: '预定',
            Team: '球队',
            Teams: '球队',
            MyTeam: '我的球队',
            CreateTeam: '创建球队',
            NoTeamPrompt: '你还没有自己的球队',
            JoinTeam: '加入球队',
            Home: '首页',
            Settings: '设置',
            ChatRoom: '聊天室',
            Create: '创建',
            CreateAccount: '创建账号',
            Quit: '退出',
            players: '队员',
            Players: '队员',
            PromoteToCaptain: '升为队长',
            Date: '日期',
            Time: '时间',
            Opponent: '对手',
            Location: '地点',
            JerseyColor: '队服颜色',
            Details: '详细信息',
            Post: '发布',
            Cancel: '取消',
            MatchNotice: '比赛通知',
            MyProfile: '我的信息',
            Height: '身高',
            Weight: '体重',
            left: '左',
            right: '右',
            Foot: '惯用脚',
            RightFoot: '右脚',
            LeftFoot: '左脚',
            Position: '场上位置',
            GK: '门神',
            CB: '中卫',
            SB: '边卫',
            DMF: '兽腰',
            AMF: '前腰',
            CF: '中锋',
            SF: '边锋',
            Feedback: '反馈',
            Submit: '提交',
            Logout: '注销',
            PleaseLogin: '请登录',
            Login: '登录',
            Createteamsuccessfully: '创建球队成功',
            Youcannotquitdefaultteam: '你不能退出默认球队',
            Captaincannotquit: '队长不能退队',
            Thanksforyourfeedback: '感谢你的反馈',
            Captain: '队长',
            Default: '默认',
            Teamexists: '球队已存在',
            Send: '发送',
            inviteyoutojoin: '邀请你加入',
            Scores: '战报',
            Score: '比分',
            League: '联赛 (即将开赛)',
            Nextmatch: '下一场比赛',
            Going: '报名',
            Cannotgo: '不报名',
            Typeyourmessage: '输入消息',
            Redcard: '红牌',
            Yellowcard: '黄牌',
            Rank : '排名',
            Message: '信息',
            Played: '出场',
            Matches: '比赛',
            Popularity: '人气',
            MyPage: '我的主页',
            Notifications: '通知',
            UpcomingMatches: '赛程',
            Today: '今天',
            Tomorrow: '明天',
            Yesterday: '昨天',
            MatchDetail: '比赛信息',
            EditPlayer: '编辑球员',
            Photo: '头像',
            Nickname: '昵称',
            HeightCM: '身高 (厘米)',
            WeightKG: '体重 (公斤)',
            Save: '保存',
            TeamName: '队名',
            ConnectWithFacebook: '用Facebook登录',
            UsingSBAccount: '或 用足球兄弟账号登陆',
            ResetPwd: '重置密码',
            ManagePlayers: '管理球员',
            ManageTeams: '管理球队',
            Me: '个人',
            PlayerInfo: '球员信息',
            Ability: '能力',
            TeamInfo: '球队信息',
            NewMatch: '新球赛',
            Notice: '注意事项',
            ResetMsg: '重置密码的连接已经发到您的邮箱。',
            InviteMsg: '球队邀请链接已复制到剪贴板。',
            Withdraw: '撤销',
            WithdrawMatch: '撤销比赛',
            FeedbackMsg: '感谢你的反馈!',
            speed: '速度',
            power: '力量',
            stamina: '体能',
            pass: '传球',
            attack: '进攻',
            defence: '防守',
            Email: '邮箱',
            Password: '密码',
            ViewAll: '查看所有',
            EditTeam: '编辑球队',
            Logo: '队徽',
            SoccerBro: '足球兄弟',
            OK: '确定'
        }
    }
}

@Pipe({
  name: 'trans'
})

export class transPipe implements PipeTransform {
  constructor(private localization: Localization) {
  }

  transform(id) {
    return this.localization.getString(id);
  }
}