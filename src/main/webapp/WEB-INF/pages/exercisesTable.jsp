<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Кипарис</title>

    <!-- Bootstrap -->
    <link href="bootstrap-3.1.1-dist/css/bootstrap.min.css" rel="stylesheet">
    <link type="bootstrap-3.1.1-dist/text/css" rel="stylesheet" href="TimeLineGroup/war/TimelineDemo3.css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- for mobile devices like android and iphone -->
    <meta content="True" name="HandheldFriendly" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    <script type="text/javascript" src="http://www.google.com/jsapi"></script>
    <script type="text/javascript" src="TimeLine/js/jquery-2.0.2.min.js"></script>
    <script type="text/javascript" src="TimeLine/js/timeline-min.js"></script>
    <script type="text/javascript" src="TimeLine/js/main.js"></script>
    <link rel="stylesheet" type="text/css" href="TimeLine/css/timeline.css">
</head>
<body>

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Кипарис</a>
        </div>
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">
                <li class="active">
                    <a href="/">График занятий</a>
                </li>
                <li>
                    <a href="/patients">Список пациентов</a>
                </li>
            </ul>
            <form class="navbar-form navbar-right" role="form">
                <div class="form-group">
                    <input type="text" placeholder="Email" class="form-control">
                </div>
                <div class="form-group">
                    <input type="password" placeholder="Password" class="form-control">
                </div>
                <button type="submit" class="btn btn-success">Sign in</button>
            </form>
        </div>
        <!--/.navbar-collapse -->
    </div>
</div>

<!-- Main jumbotron for a primary marketing message or call to action -->
<div class="jumbotron">
    <div class="container">
        <!--<h1>Hello, world!</h1>-->
        <!--<p>This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique.</p>-->
        <!--<p><a class="btn btn-primary btn-lg" role="button">Learn more &raquo;</a></p>-->
    </div>
</div>

<div class="container">
    <!-- Example row of columns -->
    <div class="row">
        <div class="col-md-3">
            <h2>Добавить занятие</h2>

            <p>Секция для добавления занятия в график занятий </p>

            <div class="form-group">
                <input type="text" placeholder="Имя пациента">
                <br/>

                <p>Поле дожно быть с автоподстановкой пациента из базы</p>
            </div>

            <a>Дата:</a>
            <script>
                $('#sandbox-container .input-group.date').datepicker({});
            </script>
            <div class="input-group date">
                <input type="text" class="form-control"><span class="input-group-addon"><i
                    class="glyphicon glyphicon-th"></i></span>
            </div>

            <div class="btn-group">
                <p>Тренажор: </p>
                <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    Выбрать тренажор: <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="">№1</a></li>
                    <li><a href="">№2</a></li>
                    <li><a href="">№3</a></li>
                    <li><a href="">№4</a></li>
                    <li><a href="">№5</a></li>
                    <li><a href="">№6</a></li>
                    <li><a href="">№7</a></li>
                    <li><a href="">№8</a></li>
                </ul>
            </div>

            <div class="btn-group">
                <p>Смена: </p>
                <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    Выбрать смену: <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <li><a href="">№1</a></li>
                    <li><a href="">№2</a></li>
                    <li><a href="">№3</a></li>
                    <li><a href="">№4</a></li>
                    <li><a href="">№5</a></li>
                    <li><a href="">№6</a></li>
                    <li><a href="">№7</a></li>
                    <li><a href="">№8</a></li>
                </ul>
            </div>


            <p>Назначил: имя того кто залогинился</p>

            <p><a class="btn btn-default" href="#" role="button">Добавить</a></p>


        </div>
        <div class="col-md-9">
            <h2>График занятий</h2>

            <p>Сюда нужно втулить график занятий. Библиотеку для графика я нашел.
                <a href="http://almende.github.io/chap-links-library/js/timeline/examples/example15_mobile.html">Вот
                    пример. </a>
                А вот <a href="http://almende.github.io/chap-links-library/timeline.html">описание библиотеки.</a>
                <br/><a>Хе хе... скрипт втулил, жалко не тот что в примере, ну и настроить его нужно конечно.</a>
            </p>
            <!-- OPTIONAL: include this if you want history support -->
            <iframe src="javascript:''" id="__gwt_historyFrame" tabIndex='-1'
                    style="position:absolute;width:0;height:0;border:0"></iframe>

            <!-- RECOMMENDED if your web app will not function without JavaScript enabled -->
            <noscript>
                <div style="color: red;">
                    Your web browser must have JavaScript enabled
                    in order for this application to display correctly.
                </div>
            </noscript>

            <div id="mytimeline"></div>


        </div>

    </div>

    <hr>

    <footer>
        <p>&copy; Company 2014</p>
    </footer>
</div>


<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="bootstrap-3.1.1-dist/js/bootstrap.min.js"></script>
</body>
</html>
