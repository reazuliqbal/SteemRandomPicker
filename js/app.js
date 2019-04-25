// Setting up default nodes
let steemdNode = 'https://anyx.io';
let hiveNode = 'https://tower.hive.oracle-d.com/api/v1';

if (localStorage.getItem('steemd')) steemdNode = localStorage.getItem('steemd');
if (localStorage.getItem('hive')) hiveNode = localStorage.getItem('hive');

const client = new window.dsteem.Client(steemdNode);

// Winner display format
const resultText = `<h2 class="text-uppercase">🎉 WINNER 🎉</h2>
<img src="https://steemitimages.com/u/{USERNAME}/avatar" alt="" class="rounded-circle border border-primary">
<p class="h4">@{USERNAME} ({REP})</p>

<p class="body text-muted">{BODY}</p>

<p><a href="https://steemit.com/@{USERNAME}/{PERMLINK}">https://steemit.com/{USERNAME}/{PERMLINK}</a></p>`;

// Retunrs username
const getUsername = user => ((user.startsWith('@')) ? user.slice(1) : user);

// Returns author and permalink from URL
const getAuthorAndPermlink = (url) => {
  const [permlink, authorWithAt] = url.split('/').reverse();
  const author = getUsername(authorWithAt);
  return {
    permlink,
    author,
  };
};

// Saves users settings
$('#saveSettings').click((e) => {
  e.preventDefault();

  const steemd = $('#steemd_node').val();
  const hive = $('#hive_node').val();

  localStorage.setItem('steemd', steemd);
  localStorage.setItem('hive', hive);

  window.location.reload();
});

// Taken from https://github.com/steemit/steem-js/blob/master/src/formatter.js
const calcReputation = (rawRep) => {
  if (rawRep == null) return rawRep;
  const reputation = parseInt(rawRep, 10);
  let rep = String(reputation);
  const neg = rep.charAt(0) === '-';
  rep = neg ? rep.substring(1) : rep;
  const str = rep;
  const leadingDigits = parseInt(str.substring(0, 4), 10);
  const log = Math.log(leadingDigits) / Math.log(10);
  const n = str.length - 1;
  let out = n + (log - parseInt(log, 10));
  if (Number.isNaN(out)) out = 0;
  out = Math.max(out - 9, 0);
  out *= (neg ? -1 : 1);
  out = (out * 9) + 25;
  out = parseInt(out, 10);
  return out;
};

// https://gist.github.com/nikolas/96586a0b56f53eabfd6fe4ed59fecb98
const shuffleArray = (array) => {
  const a = array.slice();

  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

$('#select-winner').submit(async (e) => {
  e.preventDefault();

  $('#loading').show();

  const url = $('#url').val();
  const follow = $('input[name="follow"]').val();
  const resteem = $('input[name="resteem"]').val();
  const rep = $('input[name="min_rep"]').val();

  $('.winner').hide().empty();

  const { author, permlink } = getAuthorAndPermlink(url);
  // Getting all comments for the content
  const comments = await client.database.call('get_content_replies', [author, permlink]);

  let users = comments
    .map(c => ({
      author: c.author,
      permlink: c.permlink,
      body: c.body,
      rep: calcReputation(c.author_reputation),
    }))
    .filter(u => u.rep >= rep);

  // Processing resteem if set to required
  if (resteem !== 'ignore') {
    const resteemQuery = await window.axios.get(`${hiveNode}/post_cache/${author}/${permlink}/reblogs/`);

    const resteems = resteemQuery.body.map(r => r.author);

    const resteemers = users.filter(u => resteems.includes(u.author));

    if (resteem === 'count') users.push(...resteemers);
    if (resteem === 'required') users = resteemers;
  }

  // Processing follow if set to required
  if (follow !== 'ignore') {
    const followersQuery = await window.axios.get(`${hiveNode}/accounts/${author}/followers/`);

    const followers = users.filter(u => followersQuery.body.followers.includes(u.author));

    if (follow === 'count') users.push(...followers);
    if (follow === 'required') users = followers;
  }

  // Suffling filtered partiipants and selecting one
  const winner = shuffleArray(users)[0];

  let winnerText = resultText;

  winnerText = winnerText.replace(/\{USERNAME\}/g, winner.author);
  winnerText = winnerText.replace(/\{REP\}/g, winner.rep);
  winnerText = winnerText.replace(/\{BODY\}/g, winner.body);
  winnerText = winnerText.replace(/\{PERMLINK\}/g, winner.permlink);

  $('#loading').hide();

  $('.winner').show().html(winnerText);
});
