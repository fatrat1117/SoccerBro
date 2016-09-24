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
            Description: 'description',
            West: 'West',
            East: 'East',
            Central: 'Central',
            North: 'North',
            South: 'South',
            Book: 'Book',
            Team: 'Team',
            Teams: 'Teams',
            MyTeam: 'My Team',
            CreateTeam: 'Create your Team',
            NoTeamPrompt: 'You have not joined a team',
            JoinTeam: 'Join a Team',
            Home: 'Home',
            Settings: 'Settings',
            ChatRoom: 'Chats',
            Create: 'Create',
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
            PleaseLogin: 'Please log in',
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
            Notifications: 'Notifications',
            UpcomingMatches: 'Upcoming Match',
            Today: 'Today',
            Tomorrow: 'Tomorrow',
            MatchDetail: 'Match Detail',
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
            Foot: '惯用脚',
            RightFoot: '右脚',
            LeftFoot: '左脚',
            Position: '场上位置',
            GK: '门将',
            CB: '中卫',
            SB: '边卫',
            DMF: '后腰',
            AMF: '前腰',
            CF: '中锋',
            SF: '边锋',
            Feedback: '反馈',
            Submit: '提交',
            Logout: '注销',
            PleaseLogin: '请登录',
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
            Notifications: '通知',
            UpcomingMatches: '赛程',
            Today: '今天',
            Tomorrow: '明天',
            MatchDetail: '比赛信息',
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