<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
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
    <meta content="True" name="HandheldFriendly"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
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
                <li>
                    <a href="/employees">Список Сотрудников</a>
                </li>
            </ul>
            <div class="navbar-right">
                <a class="navbar-text">Пользователь: ${userName}</a>
                <a class="navbar-brand" href="/j_spring_security_logout">Выйти</a>
            </div>
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
            <form action="/exerciseNew" method="post">
                <h2>Добавить занятие</h2>

                <div class="form-group">
                    <%--<input name="pacientName" type="text" placeholder="Имя пациента" class="form-control">--%>
                    <select name="contactId" class="form-control">
                        <c:forEach items="${contacts}" var="contact">
                            <option value="${contact.id}">${contact.secondName} ${contact.firstName}</option>
                        </c:forEach>
                    </select>
                </div>

                <div class="form-group">
                    <select name="trainer" class="form-control">
                        <option value="Trainer 1">Тренажер №1</option>
                        <option value="Trainer 2">Тренажер №2</option>
                        <option value="Trainer 3">Тренажер №3</option>
                        <option value="Trainer 4">Тренажер №4</option>
                        <option value="Trainer 5">Тренажер №5</option>
                        <option value="Trainer 6">Тренажер №6</option>
                        <option value="Trainer 7">Тренажер №7</option>
                        <option value="Trainer 8">Тренажер №8</option>
                        <option value="Massage">Массаж</option>
                        <option value="Consultation">Консультация</option>
                    </select>
                </div>

                <div class="form-group">
                    <a>Дата:</a>

                    <div class="input-group date">
                        <input name="date" type="text" class="form-control"><span class="input-group-addon"><i
                            class="glyphicon glyphicon-th"></i></span>
                    </div>
                </div>

                <div class="form-group">
                    <a>Время с:</a>
                    <input name="startTime" type="text" placeholder="c" class="form-control">
                </div>
                <div class="form-group">
                    <a>по:</a>
                    <input name="endTime" type="text" placeholder="по" class="form-control">
                </div>

                <%--<div class="btn-group">
                    <p>Тренажор: </p>
                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                        Выбрать тренажор: <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="">Тренажер №1</a></li>
                        <li><a href="">Тренажер №2</a></li>
                        <li><a href="">Тренажер №3</a></li>
                        <li><a href="">Тренажер №4</a></li>
                        <li><a href="">Тренажер №5</a></li>
                        <li><a href="">Тренажер №6</a></li>
                        <li><a href="">Тренажер №7</a></li>
                        <li><a href="">Тренажер №8</a></li>
                        <li><a href="">Массаж</a></li>
                        <li><a href="">Консультация</a></li>
                    </ul>
                </div>--%>


                <%--                <div class="form-group">
                                    <select name="session" class="form-control">
                                        <option value="1">Смена №1</option>
                                        <option value="2">Смена №2</option>
                                        <option value="3">Смена №3</option>
                                        <option value="4">Смена №4</option>
                                        <option value="5">Смена №5</option>
                                        <option value="6">Смена №6</option>
                                        <option value="7">Смена №7</option>
                                        <option value="8">Смена №8</option>
                                    </select>
                                </div>--%>


                <p>Назначил: имя того кто залогинился</p>

                <div align="left">
                    <button type="submit" class="btn btn-success" role="button">Добавить</button>
                </div>

            </form>
        </div>
        <div class="col-md-9">
            <h2>График занятий</h2>

            <%--<p>Сюда нужно втулить график занятий. Библиотеку для графика я нашел.
                <a href="http://almende.github.io/chap-links-library/js/timeline/examples/example15_mobile.html">Вот
                    пример. </a>
                А вот <a href="http://almende.github.io/chap-links-library/timeline.html">описание библиотеки.</a>
                <br/><a>Хе хе... скрипт втулил, жалко не тот что в примере, ну и настроить его нужно конечно.</a>
            </p>--%>
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
<%-- Modal dialog for editing exercise--%>
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="title">Modal title</h4>
            </div>
            <div class="modal-body">
                <form name="exerciseEdit" action="/exerciseEdit" method="post">
                    <input type="hidden" name="id">

                    <div class="form-group">
                        <select id="trainerEdit" name="trainerEdit" class="form-control">
                            <option value="Trainer 1">Тренажер №1</option>
                            <option value="Trainer 2">Тренажер №2</option>
                            <option value="Trainer 3">Тренажер №3</option>
                            <option value="Trainer 4">Тренажер №4</option>
                            <option value="Trainer 5">Тренажер №5</option>
                            <option value="Trainer 6">Тренажер №6</option>
                            <option value="Trainer 7">Тренажер №7</option>
                            <option value="Trainer 8">Тренажер №8</option>
                            <option value="Massage">Массаж</option>
                            <option value="Consultation">Консультация</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <a>Дата:</a>

                        <div class="input-group date">
                            <input name="dateEdit" type="text" class="form-control"><span class="input-group-addon"><i
                                class="glyphicon glyphicon-th"></i></span>
                        </div>
                    </div>

                    <div class="form-group">
                        <a>Время с:</a>
                        <input name="startTimeEdit" type="text" placeholder="c" class="form-control">
                    </div>
                    <div class="form-group">
                        <a>по:</a>
                        <input name="endTimeEdit" type="text" placeholder="по" class="form-control">
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Отменить</button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
                </form>
            </div>
        </div>
    </div>
</div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="bootstrap-3.1.1-dist/js/bootstrap.min.js"></script>
</body>
</html>
