const room = HBInit({
  roomName: "PEGA",
  maxPlayers: 10,
  public: true,
  noPlayer: true,
  token: "BURAYA_TOKENINI_YAPIŞTIR"
});

let admins = new Set();
let muted = new Set();

room.onPlayerJoin = (player) => {
  room.sendAnnouncement(player.name + " odaya katıldı", null, 0x00ff00, "bold");
};

room.onPlayerLeave = (player) => {
  admins.delete(player.id);
  muted.delete(player.id);
};

room.onPlayerChat = (player, message) => {
  if (muted.has(player.id)) return false;

  const args = message.split(" ");
  const cmd = args[0];

  // ADMIN
  if (cmd === "!admin") {
    if (!admins.has(player.id)) {
      admins.add(player.id);
      room.sendAnnouncement(player.name + " admin oldu", null, 0xffaa00, "bold");
    }
    return false;
  }

  // AFK
  if (cmd === "!afk") {
    room.setPlayerTeam(player.id, 0);
    room.sendAnnouncement(player.name + " AFK oldu", null, 0xaaaaaa);
    return false;
  }

  // KICK
  if (cmd === "!kick") {
    if (admins.has(player.id)) {
      let target = room.getPlayer(Number(args[1]));
      if (target) room.kickPlayer(target.id, "Kicklendi", false);
    }
    return false;
  }

  // MUTE
  if (cmd === "!mute") {
    if (admins.has(player.id)) {
      let target = room.getPlayer(Number(args[1]));
      if (target) {
        muted.add(target.id);
        room.sendAnnouncement(target.name + " mute yedi", null, 0xff0000);
      }
    }
    return false;
  }

  // UNMUTE
  if (cmd === "!unmute") {
    if (admins.has(player.id)) {
      let target = room.getPlayer(Number(args[1]));
      if (target) {
        muted.delete(target.id);
        room.sendAnnouncement(target.name + " unmute oldu", null, 0x00ff00);
      }
    }
    return false;
  }

  // MAP CHANGE
  if (cmd === "!map") {
    if (admins.has(player.id)) {
      room.setCustomStadium(args[1]);
      room.sendAnnouncement("Map değişti: " + args[1], null, 0x00ffff);
    }
    return false;
  }

  return true;
};