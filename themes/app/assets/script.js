const token = '27fcd3519a574cf48e1dcc04118af4ab';

function activeMenu(menu) {
    const currentMenuActive = $('.main-menu .active');
    const currentAppActive = $('.app .active');

    currentMenuActive.removeClass('active');
    currentAppActive.removeClass('active');

    const activeMenu = $('.main-menu #menu_' + menu);
    const activeApp = $('.app #' + menu);

    activeMenu.addClass('active');
    activeApp.addClass('active');
}

function toggleTableAndDetailed(timeOut = 500) {
    $('.table-competition, .competition-detailed').toggle(timeOut);
}

function strLimit(stringValue, limit = 50, end = '...') {
    if (stringValue.length <= limit) {
        return stringValue;
    }
    return stringValue.substr(0, limit) + '...';
}

$(function() {
    const defaultLoad = $('.default-load');
    let competitionsList = [];
    let matches = [];

    /**
     * Fazendo listagem de competições
     */
    $("[data-competitions]").click(function(e) {
        let currentActive = $('.soccer-content .active');
        if (currentActive.length != 0) {
            currentActive.removeClass('active');
        }

        $('.soccer-competition').addClass('active');

        if (competitionsList.length != 0) {
            return;
        }

        const clicked = $(this);
        const action = clicked.data("competitions");

        defaultLoad.css('display', 'flex');

        $.ajax({
            headers: { 'X-Auth-Token': token },
            url: action + '?plan=TIER_ONE',
            dataType: 'json',
            type: 'GET',
        }).done(function(response) {
            const table = $('.table-competition');
            competitionsList = response.competitions;

            let tableHtml = '<thead>' +
                '<tr>' +
                '<th scope="col">Pais</th>' +
                '<th scope="col">#</th>' +
                '<th scope="col">Campeonato</th>' +
                '<th scope="col">Opções</th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';


            for (let i in competitionsList) {
                let competition = competitionsList[i];
                let image = competition.emblemUrl;
                if (image == null) {
                    image = competition.area.ensignUrl;
                    if (image == null) {
                        image = url + 'themes/app/assets/images/soccer.png';
                    }
                }

                tableHtml += '<tr>'
                tableHtml += '<td>' + competition.area.countryCode + '</td>';
                tableHtml += '<td><img width="32" height="32" src="' + image + '"/></td>';
                tableHtml += '<td>' + competition.name + '</td>';
                tableHtml += '<td>';
                tableHtml += '<div class="competitionOptions">';
                tableHtml += '<a href="#" data-competition_detail="http://api.football-data.org/v2/competitions/' + competition.id + '">Últimos Campeões</a>';
                tableHtml += '<a href="#" data-competition_stadings="http://api.football-data.org/v2/competitions/' + competition.id + '/standings">Classificação</a>';
                tableHtml += '<a href="#" data-competition_scores="http://api.football-data.org/v2/competitions/' + competition.id + '/scorers?limit=10">Artilheiros</a>';
                tableHtml += '</div>';
                tableHtml += '</td>';

            }

            tableHtml += '</tbody>';

            table.html(tableHtml);

            defaultLoad.css('display', 'none');
        });
    });

    /**
     * Apresetando detalhes de competição
     */
    $(document).on('click', '[data-competition_detail]', function(e) {
        let clicked = $(this);
        let action = clicked.data('competition_detail');

        defaultLoad.css('display', 'flex');

        $.ajax({
            headers: { 'X-Auth-Token': token },
            url: action,
            dataType: 'json',
            type: 'GET'
        }).done(function(response) {
            const championshipDetailed = $('.competition-detailed');
            let championshipHtml = '';

            let imageChampionship = response.emblemUrl;
            if (imageChampionship == null) {
                imageChampionship = url + 'themes/app/assets/images/soccer.png';
            }

            championshipHtml += '<div class="championship-header">';
            championshipHtml += '<img width="32" height="32" src="' + imageChampionship + '"/>'
            championshipHtml += '<h5 class="mx-5">' + response.name + '</h5>';
            championshipHtml += '</div>';

            championshipHtml += '<div class="championship-body">';
            championshipHtml += '<h5>Últimos Campeões</h5>';

            championshipHtml += '<table class="table">';
            championshipHtml += '<thead>';
            championshipHtml += '<tr>';
            championshipHtml += '<th>Ano</th>';
            championshipHtml += '<th>#</th>';
            championshipHtml += '<th>Clube</th>';
            championshipHtml += '</tr>';
            championshipHtml += '</thead>';
            championshipHtml += '<tbody>';

            for (var i in response.seasons) {
                let season = response.seasons[i];

                if (season.winner != null) {
                    let year = season.startDate.split("-")[0];
                    let image = season.winner.crestUrl;
                    if (image == null) {
                        image = url + 'themes/app/assets/images/soccer.png';
                    }

                    championshipHtml += '<tr>';
                    championshipHtml += '<td>' + year + '</td>';
                    championshipHtml += '<td><img src="' + image + '" width="32" height="32"/></td>';
                    championshipHtml += '<td>' + season.winner.shortName + '</td>';
                    championshipHtml += '</tr>';
                }
            }

            championshipHtml += '</tbody>';
            championshipHtml += '</table>';
            championshipHtml += '</div>';
            championshipHtml += '<button class="btn btn-outline-primary" onclick="toggleTableAndDetailed();">Voltar</button>';

            championshipDetailed.html(championshipHtml);

            toggleTableAndDetailed();

            defaultLoad.css('display', 'none');
        });
    });

    /**
     * Classificação atual do campeonato
     */
    $(document).on('click', '[data-competition_stadings]', function(e) {
        const offcanvas = $('.offcanvas-standings');
        const body = $('.offcanvas-standings .body');
        let clicked = $(this);
        let action = clicked.data('competition_stadings');

        defaultLoad.css('display', 'flex');

        $.ajax({
            headers: { 'X-Auth-Token': token },
            url: action,
            dataType: 'json',
            type: 'GET'
        }).done(function(response) {
            body.html('');

            $('.offcanvas-standings .title').html(response.competition.name);

            let teamHtml = '';

            teamHtml += '<div class="row no-margin-x">';
            teamHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold">P.</div>';
            teamHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold">Clube</div>';
            teamHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold">Pontos</div>';
            teamHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold">V</div>';
            teamHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold">E</div>';
            teamHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold">D</div>';
            teamHtml += '</div>';

            body.append(teamHtml);

            for (let i in response.standings[0].table) {
                teamHtml = '';
                const team = response.standings[0].table[i];

                let club = '<img width="25" height="25" src="' + team.team.crestUrl + '" alt="' + team.team.name + '"/>';
                if (team.team.crestUrl == null) {
                    club = team.team.name;
                }

                teamHtml += '<div class="row mb-2 no-margin-x">';
                teamHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + team.position + '</div>';
                teamHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + club + '</div>';
                teamHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + team.points + '</div>';
                teamHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + team.won + '</div>';
                teamHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + team.draw + '</div>';
                teamHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + team.lost + '</div>';
                teamHtml += '</div>';
                body.append(teamHtml);
            }

            offcanvas.addClass('show');
            defaultLoad.css('display', 'none');
        }).fail(function(response) {
            defaultLoad.css('display', 'none');
            alert('Tabela de Classificação não encontrada');
        });
    });

    /**
     * Artilharia atual do campeonato
     */
    $(document).on('click', '[data-competition_scores]', function(e) {
        const offcanvas = $('.offcanvas-standings');
        const body = $('.offcanvas-standings .body');
        let clicked = $(this);
        let action = clicked.data('competition_scores');

        defaultLoad.css('display', 'flex');

        $.ajax({
            headers: { 'X-Auth-Token': token },
            url: action,
            dataType: 'json',
            type: 'GET'
        }).done(function(response) {
            body.html('');

            $('.offcanvas-standings .title').html(response.competition.name);

            let teamHtml = '';

            teamHtml += '<div class="row no-margin-x">';
            teamHtml += '<div class="col-5 padding-left-zero padding-right-zero fw-bold">Jogador</div>';
            teamHtml += '<div class="col-5 padding-left-zero padding-right-zero fw-bold">Clube</div>';
            teamHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold">Gols</div>';
            teamHtml += '</div>';

            body.append(teamHtml);

            for (let i in response.scorers) {
                teamHtml = '';
                const player = response.scorers[i].player;
                const team = response.scorers[i].team;

                teamHtml += '<div class="row mb-2 no-margin-x">';
                teamHtml += '<div class="col-5 padding-left-zero padding-right-zero">' + strLimit(player.name, 15) + '</div>';
                teamHtml += '<div class="col-5 padding-left-zero padding-right-zero">' + strLimit(team.name, 15) + '</div>';
                teamHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + response.scorers[i].numberOfGoals + '</div>';
                teamHtml += '</div>';
                body.append(teamHtml);
            }

            offcanvas.addClass('show');
            defaultLoad.css('display', 'none');
        }).fail(function(response) {
            defaultLoad.css('display', 'none');
            alert('Tabela de Artilheiros não encontrada');
        });
    });

    /**
     * Partidas de hoje
     */
    $('[data-matchs]').click(function(e) {
        let currentActive = $('.soccer-content .active');
        if (currentActive.length != 0) {
            currentActive.removeClass('active');
        }

        let soccerMathes = $('.soccer-matches');
        soccerMathes.addClass('active');

        if (matches.length != 0) {
            return;
        }

        const clicked = $(this);
        const action = clicked.data("matchs");

        defaultLoad.css('display', 'flex');

        let matchesHtml = '';

        $.ajax({
            headers: { 'X-Auth-Token': token },
            url: action,
            dataType: 'json',
            type: 'GET'
        }).done(function(response) {
            let matches = response.matches;

            for (var i in matches) {
                let match = matches[i];
                let homeTeamScore = match.score.fullTime.homeTeam == null ? 0 : match.score.fullTime.homeTeam;
                let awayTeamScore = match.score.fullTime.awayTeam == null ? 0 : match.score.fullTime.awayTeam;
                let matchDate = new Date(match.utcDate);
                let now = new Date();

                let gameStarted = matchDate.toLocaleDateString("pt-BR");
                if (now > matchDate) {
                    gameStarted = "Iniciado";
                }

                let teamHomeScoreClass = '';
                let teamAwayScoreClass = '';

                if (homeTeamScore < awayTeamScore) {
                    teamHomeScoreClass = 'text-danger';
                    teamAwayScoreClass = 'text-primary';
                } else if (homeTeamScore > awayTeamScore) {
                    teamHomeScoreClass = 'text-primary';
                    teamAwayScoreClass = 'text-danger';
                }

                matchesHtml += '<div class="row no-margin-x">';
                matchesHtml += '<div class="col-12 padding-left-zero padding-right-zero fw-bold mb-2">Competição: ' + match.competition.name + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero ' + teamHomeScoreClass + '">' + strLimit(match.homeTeam.name, 20) + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold ' + teamHomeScoreClass + '">' + homeTeamScore  + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero"> X </div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold ' + teamAwayScoreClass + '">' + awayTeamScore + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero ' + teamAwayScoreClass + '">' + strLimit(match.awayTeam.name, 20) + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + gameStarted + '</div>';
                matchesHtml += '</div>';
                matchesHtml += '<hr/>';
            }

            soccerMathes.html(matchesHtml);
            defaultLoad.css('display', 'none');
        });
    });


    /*
     * OFFCANVAS
     */

    $(document).on('click', '[data-offcanvas-close]', function () {
        let element = $(this);
        let dataset = element.data();

        $('.' + dataset.offcanvasClose).removeClass('show');
    });
});