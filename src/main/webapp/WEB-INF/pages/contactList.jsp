<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html lang="en" xmlns="http://www.w3.org/1999/html">
<head>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <%@taglib prefix="spring" uri="http://www.springframework.org/tags" %>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Кипарис</title>

    <!-- Bootstrap -->
    <link href="/bootstrap-3.1.1-dist/css/bootstrap.min.css" rel="stylesheet">
    <link type="/bootstrap-3.1.1-dist/text/css" rel="stylesheet" href="TimeLineGroup/war/TimelineDemo3.css">
    <!--<link type="text/css" rel="stylesheet" href="TimeLineGroup/war/TimelineDemo3.css">-->
    <script type="text/javascript" language="javascript"
            src="TimeLineGroup/war/timelinedemo3/timelinedemo3.nocache.js"></script>

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
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
                <li>
                    <a href="/">График занятий</a>
                </li>
                <li class="active">
                    <a href="/patients">Список пациентов</a>
                </li>
            </ul>
            <div class="navbar-right">
                <a class="navbar-text">${userName}</a>
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
        <div class="col-md-2">
            <form action="/patients/new" method="post">
                <h2>Добавить:</h2>

                <div class="form-group">
                    <input name="lastName" type="text" placeholder="Фамилия:" class="form-control">
                </div>
                <div class="form-group">
                    <input name="firstName" type="text" placeholder="Имя:" class="form-control">
                </div>
                <div class="form-group">
                    <input name="midleName" type="text" placeholder="Отчество:" class="form-control">
                </div>

                <a>Дата рождения:</a>

                <div class="input-group date form-group">
                    <input name="date" type="text" class="form-control"><span class="input-group-addon"><i
                        class="glyphicon glyphicon-th"></i></span>
                </div>

                <div class="form-group">
                    <input name="profession" type="text" placeholder="Професия:" class="form-control">
                </div>

                <div class="form-group">
                    <label>Диагноз:</label>
                    <select name="diagnosis" class="form-control">
                        <option value="GRIGA">GRIGA</option>
                        <option value="PERELOM">PERELOM</option>
                        <option value="PRATRYZIYA">PRATRYZIYA</option>
                    </select>
                </div>
                <div class="form-group">
                    <textarea name="comments" rows="5" placeholder="Коментарии:" class="form-control"></textarea>
                </div>


                <p>Назначил: имя того кто залогинился</p>

                <p>
                    <button type="submit" class="btn btn-success" role="button">Добавить</button>
                </p>
            </form>


        </div>
        <div class="col-md-9">
            <h2>Список пациентов:</h2>

            <div class="panel panel-default">
                <!-- Default panel contents -->
                <div class="panel-heading"></div>

                <table class="table">
                    <thead>
                    <tr>
                        <td><b></b></td>
                        <td><b>ID</b></td>
                        <td><b>Фото</b></td>
                        <td><b>Фамилия</b></td>
                        <td><b>Имя</b></td>
                        <td><b>Отчество</b></td>
                        <td><b>Диагноз</b></td>
                        <td><b>Дата рождения</b></td>
                        <td><b>Занятий пройдено</b></td>
                        <td><b>Профессия</b></td>
                        <td><b>Создано</b></td>
                    </tr>
                    </thead>
                    <c:forEach items="${contacts}" var="contact">
                        <tr>
                            <td>

                                    <!-- Button trigger modal -->
                                    <button class="btn btn-warning" data-toggle="modal" data-target="#myModal">
                                        <span class="glyphicon glyphicon-pencil"></span>
                                    </button>
                                    <!-- Delete Patient -->
                                    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                                    <h4 class="modal-title" id="myModalLabel">Подтвердите:</h4>
                                                </div>
                                                <div class="modal-body">
                                                    <h4 class="modal-body">Вы действительно хотите удалить пациента ${contact.secondName} ${contact.firstName}?</h4>
                                                </div>
                                                <div class="modal-footer">

                                                    <form action="/patients/remove" method="post">
                                                        <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                                                        <input name="removeID"  type="hidden" value="${contact.id}">
                                                    <button type="submit" class="btn btn-danger">Удалить</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                            </td>
                            <td>${contact.id}</td>
                            <td>${contact.photo}</td>
                            <td>${contact.firstName}</td>
                            <td>${contact.secondName}</td>
                            <td>${contact.thirdName}</td>
                            <td>${contact.diagnosis}</td>
                            <td>${contact.birthday}</td>
                            <td>${contact.exercisesPassed}</td>
                            <td>${contact.profession}</td>
                            <td>${contact.created}</td>
                        </tr>
                    </c:forEach>
                </table>

            </div>
        </div>


    </div>

    <hr>


</div>

<footer>
    <p>&copy; Company 2014</p>
</footer>


<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="/bootstrap-3.1.1-dist/js/bootstrap.min.js"></script>
</body>
</html>
