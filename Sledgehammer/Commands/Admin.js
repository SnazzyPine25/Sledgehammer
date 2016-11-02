/*
	Admin.js
	Commands for admin commands such as ban and kick
*/

let Utils = {
	Kick: (Mentions, message) => { // Function for kicking users
		return new Promise((resolve, reject) => {
			let Kicked = [];
			let i = 0;
			Mentions.map((user) => {
				message.guild.fetchMember(user).then((gUser) => {
					gUser.kick().then(() => {
						Kicked.push(`${user.username} (${user.id})`);
						i++;
						if(i === Mentions.size){
							resolve(Kicked);
						}
					}).catch((e) => {
						i++;
						if(i === Mentions.size){
							resolve(Kicked);
						}
					});
				});
			});
		});
	},
	Ban: (Mentions, message) => { // Function for banning users
		return new Promise((resolve, reject) => {
			let Banned = [];
			let i = 0;
			Mentions.map((user) => {
				message.guild.fetchMember(user).then((gUser) => {
					gUser.ban().then(() => {
						Banned.push(`${user.username} (${user.id})`);
						i++;
						if(i === Mentions.size){
							resolve(Banned);
						}
					}).catch((e) => {
						i++;
						if(i === Mentions.size){
							resolve(Banned);
						}
					});
				});
			});
		});
	},
	Clean: (message, Count, User) => { // Cleaning messages
		console.log(User);
		return new Promise((resolve, reject) => {
			let i = 0;
			let toClean = 0;
			message.channel.fetchMessages({limit: Count}).then((messages) => {
				messages.map((a) => {
					if(User !== ""){
						if(a.author.id === User){
							toClean++;
						}
					}		
				});
				messages.map((ms) => {
					if(User !== ""){
						if(ms.author.id === User){
							ms.delete().then(() => {
								i++;
								if(i === toClean || i === messages.size){
									resolve(i);
								}
							}).catch((e) => {
								i++;
								if(i === toClean || i === messages.size){
									resolve(i);
								}
							});	
						}
					}else{
						ms.delete().then(() => {
							i++;
							if(i === Count || i === messages.size){
								resolve(i);
							}
						}).catch((e) => {
							i++;
							if(i === Count || i === messages.size){
								resolve(i);
							}
						});	
					}
				});
			});
		});
	}
}

module.exports = {
	Metadata: {
		List: ['kick', 'ban', 'clean', 'blacklist', 'whitelist'],
		Name: "Admin Commands",
		Description: "Administrative commands"
	},

	kick: {
		Execute: (Args, message) => {
			let Member = message.guild.fetchMember(message.author);
			if(Args.length >= 1){
				let Mentions = message.mentions.users;
				if(Mentions.size >= 1){
					if(message.channel.permissionsFor(message.author).hasPermission("KICK_MEMBERS")){
						if(message.channel.permissionsFor(Sledgehammer.user).hasPermission("KICK_MEMBERS")){
							let toSend = "";
							Utils.Kick(Mentions, message).then((Kicked) => {
								let s = new Server(message.guild.id);
								let and = "";
								let kicker = message.author.username;
								let kicks = `${Kicked.length>1?'users':'user'}`;
								toSend = `:white_check_mark: ${message.author.username} Kicked ${Kicked.length>1?'users':'user'}`;
								if(Kicked.length >= 2){
									and = Kicked.pop();
								}
								kicks += ` ${Kicked.join(',')} ${and.length>0?'and':''} ${and.length>0?and:''}`;
								toSend += ` ${Kicked.join(',')} ${and.length>0?'and':''} ${and.length>0?and:''}`;
								s.modlog.then((ml) => {
									if(ml === null){
										ml = message.channel.id;
									}
									s.channels.then((channels) => {
										if(channels !== null){
											if(channels.kickLog !== null && channels.kickLog !== undefined){
												let time = new Date();
												let ms = channels.kickLog.message.replace(/\${kicker}/gi, kicker).replace(/\${kickCount}/gi, Kicked.length).replace(/\${kicks}/gi, kicks);
												toSend = DateFormat.formatDate(time, ms);
												ml = channels.kickLog.id;
											}
										}

										s.messages.then((messages) => {
											if(messages !== null){
												if(messages.kick !== null){
													if(messages.kick){
														message.guild.channels.find("id", ml).sendMessage(toSend);
													}
												}else{
													message.guild.channels.find("id", ml).sendMessage(toSend);
												}
											}else{
												message.guild.channels.find("id", ml).sendMessage(toSend);
											}
										});

									});
								});
							});
						}else{
							message.channel.sendMessage(`:no_entry_sign: I can't do that, ${message.author.username}, I'm missing the permission to kick members.`);
						}
					}else{
						message.channel.sendMessage(`:no_entry_sign: I can't let you do that, ${message.author.username}. You don't have the permission to kick members.`);
					}
				}else{
					message.channel.sendMessage(`I can't do that, ${message.author.username},`)
				}
			}
		},
		Cooldown: 5,
		Description: "Kicks members from the server.",
		Usage: "`@user` `[@user]` `[@user]...`"
	},

	ban: {
		Execute: (Args, message) => {
			let Member = message.guild.fetchMember(message.author);
			let s = new Server(messages.guild.id);
			if(Args.length >= 1){
				let Mentions = message.mentions.users;
				if(Mentions.size >= 1){
					if(message.channel.permissionsFor(message.author).hasPermission("BAN_MEMBERS")){
						if(message.channel.permissionsFor(Sledgehammer.user).hasPermission("BAN_MEMBERS")){
							let toSend = "";
							let banner = message.author.username;
							Utils.Ban(Mentions, message).then((Banned) => {
								let and = "";
								let bans = `${Banned.length>1?'users':'user'}`;
								toSend = `:white_check_mark: ${message.author.username} Banned ${Banned.length>1?'users':'user'}`;
								if(Banned.length >= 2){
									and = Banned.pop();
								}
								bans += ` ${Banned.join(',')} ${and.length>0?'and':''} ${and.length>0?and:''}`;
								toSend += ` ${Banned.join(',')} ${and.length>0?'and':''} ${and.length>0?and:''}`;
								s.modlog.then((ml) => {
									if(ml === null){
										ml = message.channel.id;
									}
									s.channels.then((channels) => {
										if(channels !== null){
											if(channels.banLog !== null && channels.banLog !== undefined){
												let time = new Date();
												let ms = channels.banLog.message.replace(/\${banner}/gi, banner).replace(/\${banCount}/gi, Banned.length).replace(/\${bans}/gi, bans);
												toSend = DateFormat.formatDate(time, ms);
												ml = channels.banLog.id;
											}
										}

										s.messages.then((messages) => {
											if(messages !== null){
												if(messages.ban !== null){
													if(messages.ban){
														message.guild.channels.find("id", ml).sendMessage(toSend);
													}
												}else{
													message.guild.channels.find("id", ml).sendMessage(toSend);
												}
											}else{
												message.guild.channels.find("id", ml).sendMessage(toSend);
											}
										});

									});
								});
							});
						}else{
							message.channel.sendMessage(`:no_entry_sign: I can't do that, ${message.author.username}, I'm missing the permission to ban members.`);
						}
					}else{
						message.channel.sendMessage(`:no_entry_sign: I can't let you do that, ${message.author.username}. You don't have the permission to ban members.`);
					}
				}else{
					message.channel.sendMessage(`I can't do that, ${message.author.username},`)
				}
			}
		},
		Cooldown: 5,
		Description: "Bans members from the server.",
		Usage: "`@user` `[@user]` `[@user]...`"
	},

	clean: {
		Execute: (Args, message) => {
			let Member = message.guild.fetchMember(message.author);
			let purgeCount = 10;
			if(Args.length >= 1){
				purgeCount = parseInt(Args[0]) || 10;
			}
			if(message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")){
				if(message.channel.permissionsFor(Sledgehammer.user).hasPermission("MANAGE_MESSAGES")){
					let user = "";
					if(message.mentions.users.size >= 1){
						user = message.mentions.users.first().id;
					}
					let toSend = "";
					Utils.Clean(message, purgeCount, user).then((Purged) => {
						toSend = `Purged ${Purged.formatNumber()} messages in ${message.channel}.`;
						message.channel.sendMessage(toSend);
					});
				}else{
					message.channel.sendMessage(`:no_entry_sign: I can't do that, ${message.author.username}, I'm missing the permission to manage messages.`);
				}
			}else{
				message.channel.sendMessage(`:no_entry_sign: I can't let you do that, ${message.author.username}. You don't have the permission to manage messages.`);
			}
		},
		Cooldown: 5,
		Description: "Purges messages",
		Usage: "`[amount]`, `[@user]`"
	},

	blacklist: {
		Execute: (Args, message) => {
			if(Args.length >= 1){
				if(message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")){
					if(message.channel.permissionsFor(Sledgehammer.user).hasPermission("MANAGE_MESSAGES")){
						let server = new Server(message.guild.id);
						server.blacklistAdd(Args.join(" ")).then(() => {
							message.channel.sendMessage(`:white_check_mark: Blacklisted \`${Args.join(" ")}\`.`);
						}).catch((e) => {
							message.channel.sendMessage(`:x: Something went wrong, ${message.author.username}.`);
						});
					}else{
						message.channel.sendMessage(`:no_entry_sign: I can't do that, ${message.author.username}, I'm missing the permission to manage messages.`);
					}
				}else{
					message.channel.sendMessage(`:no_entry_sign: I can't let you do that, ${message.author.username}. You don't have the permission to manage messages.`);
				}
			}else{

				message.channel.sendMessage(`:no_entry_sign: Not enough arguments, ${message.author.username}.`);
			}
		},
		Cooldown: 5,
		Description: "Adds a word or phrase to the blacklist.",
		Usage: "``Word/RegExp``"
	},

	whitelist: {
		Execute: (Args, message) => {
			if(Args.length >= 1){
				if(message.channel.permissionsFor(message.author).hasPermission("MANAGE_MESSAGES")){
					if(message.channel.permissionsFor(Sledgehammer.user).hasPermission("MANAGE_MESSAGES")){
						let server = new Server(message.guild.id);
						server.removeBlacklist(Args.join(" ")).then(() => {
							message.channel.sendMessage(`:white_check_mark: Removed \`${Args.join(" ")}\` from the blacklist.`);
						}).catch((e) => {
							message.channel.sendMessage(`:x: Something went wrong, ${message.author.username}.`);
						});
					}else{
						message.channel.sendMessage(`:no_entry_sign: I can't do that, ${message.author.username}, I'm missing the permission to manage messages.`);
					}
				}else{
					message.channel.sendMessage(`:no_entry_sign: I can't let you do that, ${message.author.username}. You don't have the permission to manage messages.`);
				}
			}else{

				message.channel.sendMessage(`:no_entry_sign: Not enough arguments, ${message.author.username}.`);
			}
		},
		Cooldown: 5,
		Description: "Removes a word or phrase from the blacklist.",
		Usage: "``Word/RegExp``"
	}
}