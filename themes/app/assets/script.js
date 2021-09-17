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

$(function () {
    const defaultLoad = $('.default-load');
    let competitionsList = [];
    let matches = [];

    /**
     * Fazendo listagem de competições
     */
    $("[data-competitions]").click(function (e) {
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
        }).done(function (response) {
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
    $(document).on('click', '[data-competition_detail]', function (e) {
        let clicked = $(this);
        let action = clicked.data('competition_detail');

        defaultLoad.css('display', 'flex');

        $.ajax({
            headers: { 'X-Auth-Token': token },
            url: action,
            dataType: 'json',
            type: 'GET'
        }).done(function (response) {
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
    $(document).on('click', '[data-competition_stadings]', function (e) {
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
        }).done(function (response) {
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
        }).fail(function (response) {
            defaultLoad.css('display', 'none');
            alert('Tabela de Classificação não encontrada');
        });
    });

    /**
     * Artilharia atual do campeonato
     */
    $(document).on('click', '[data-competition_scores]', function (e) {
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
        }).done(function (response) {
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
        }).fail(function (response) {
            defaultLoad.css('display', 'none');
            alert('Tabela de Artilheiros não encontrada');
        });
    });

    /**
     * Partidas de hoje
     */
    $('[data-matchs]').click(function (e) {
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
        }).done(function (response) {
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
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold ' + teamHomeScoreClass + '">' + homeTeamScore + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero"> X </div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero fw-bold ' + teamAwayScoreClass + '">' + awayTeamScore + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero ' + teamAwayScoreClass + '">' + strLimit(match.awayTeam.name, 20) + '</div>';
                matchesHtml += '<div class="col-2 padding-left-zero padding-right-zero">' + gameStarted + '</div>';
                matchesHtml += '</div>';
                matchesHtml += '<hr/>';
            }

            soccerMathes.html(matchesHtml);
            defaultLoad.css('display', 'none');
        }).fail(function (response) {
            defaultLoad.css('display', 'none');
            alert('Houve um erro ao recuperar as partidas');
        });
    });

    $('[data-covid_cases]').click(function (e) {
        const clicked = $(this);
        const action = clicked.data("covid_cases");
        const content = $('.covid-content');

        content.html('');

        defaultLoad.css('display', 'flex');

        $.ajax({
            url: action,
            type: 'GET'
        }).done(function(response) {
            let casesHtml = '';
            let allCases = response.All;

            delete response.All;

            casesHtml += '<div class="row mb-3">';
            casesHtml += '<div class="col-12 mb-2">';
            casesHtml += '<h4>Total de Casos</h4>';
            casesHtml += '</div>';
            casesHtml += '<div class="col-12 covid-head">';
            casesHtml += '<span class="fs-6 badge bg-warning">Confirmados: ' + allCases.confirmed + '</span>';
            casesHtml += '<span class="fs-6 badge bg-danger ms-2">Mortes: ' + allCases.deaths + '</span>';
            casesHtml += '</div>';
            casesHtml += '</div>';

            casesHtml += '<table class="table">';
            casesHtml += '<thead>';
            casesHtml += '<tr>';
            casesHtml += '<th>Estado</th>';
            casesHtml += '<th>Confirmados</th>';
            casesHtml += '<th>Mortes</th>';
            casesHtml += '</tr>';
            casesHtml += '</thead>';

            casesHtml += '<tbody>';
            for (var i in response) {
                casesHtml += '<tr>';
                casesHtml += '<td>' + i + '</td>';
                casesHtml += '<td><span class="text-warning fw-bold">' + response[i].confirmed + '</span></td>';
                casesHtml += '<td><span class="text-danger fw-bold">' + response[i].deaths + '</span></td>';
                casesHtml += '</tr>';
            }

            casesHtml += '</tbody>';
            casesHtml += '</table>';

            defaultLoad.css('display', 'none');

            content.html(casesHtml);
        }).fail(function(response) {
            alert("Houve um erro na recuperação de casos")
        })
    });

    $('[data-covid_vaccines]').click(function (e) {
        const clicked = $(this);
        const action = clicked.data("covid_vaccines");
        const content = $('.covid-content');

        content.html('');

        defaultLoad.css('display', 'flex');
        $.ajax({
            url: action,
            type: 'GET'
        }).done(function(response) {
            let vaccinesHtml = '';
            let allVaccines = response.All;

            delete response.All;

            vaccinesHtml += '<div class="row mb-3">';
            vaccinesHtml += '<div class="col-12 mb-2">';
            vaccinesHtml += '<h4>Vacinação</h4>';
            vaccinesHtml += '</div>';
            vaccinesHtml += '<div class="col-12 covid-head">';
            vaccinesHtml += '<span class="fs-6 badge bg-secondary">População: ' + allVaccines.population + '</span>';
            vaccinesHtml += '<span class="fs-6 badge bg-success ms-2">Vacinados: ' + allVaccines.administered + '</span>';
            vaccinesHtml += '<span class="fs-6 badge bg-primary ms-2">Completamente: ' + allVaccines.people_vaccinated + '</span>';
            vaccinesHtml += '<span class="fs-6 badge bg-warning ms-2">Parcialmente: ' + allVaccines.people_partially_vaccinated + '</span>';
            vaccinesHtml += '</div>';
            vaccinesHtml += '</div>';

            vaccinesHtml += '<table class="table">';
            vaccinesHtml += '<thead>';
            vaccinesHtml += '<tr>';
            vaccinesHtml += '<th colspan="2">Estado</th>';
            vaccinesHtml += '<th>Vacinados</th>';
            vaccinesHtml += '</tr>';
            vaccinesHtml += '</thead>';

            vaccinesHtml += '<tbody>';
            for (var i in response) {
                vaccinesHtml += '<tr>';
                vaccinesHtml += '<td colspan="2">' + i + '</td>';
                vaccinesHtml += '<td><span class="text-success fw-bold">' + response[i].administered + '</span></td>';
                vaccinesHtml += '</tr>';
            }

            vaccinesHtml += '</tbody>';
            vaccinesHtml += '</table>';

            defaultLoad.css('display', 'none');

            content.html(vaccinesHtml);
        }).fail(function(response) {
            defaultLoad.css('display', 'none');
            alert("Houve um erro na recuperação de vacinas")
        })
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