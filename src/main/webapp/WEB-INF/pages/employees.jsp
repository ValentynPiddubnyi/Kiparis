<%--
  Created by IntelliJ IDEA.
  User: fil
  Date: 4/15/14
  Time: 11:29 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
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
                <li>
                    <a href="/patients">Список пациентов</a>
                </li>
                <li class="active">
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

        <div class="col-md-9">
            <h2>Список сотрудников:</h2>

            <div class="panel panel-default">
                <!-- Default panel contents -->
                <div class="panel-heading"></div>
                <table class="table">
                    <thead>
                    <tr>
                        <td></td>
                        <td><b>ID</b></td>
                        <td><b>Фотография</b></td>
                        <td><b>Фамилия</b></td>
                        <td><b>Имя</b></td>
                        <td><b>Отчество</b></td>
                        <td><b>Дата рожения</b></td>
                        <td><b>Телефон</b></td>
                        <td><b>Email</b></td>
                        <td><b>Адресс</b></td>
                    </tr>
                    </thead>
                    <c:forEach items="${employees}" var="employee">
                        <tr>
                            <td>
                                <!-- Button trigger modal -->
                                <button class="btn btn-warning" data-toggle="modal" data-target="#myModal${employee.id}">
                                    <span class="glyphicon glyphicon-pencil"></span>
                                </button>
                                <!-- Editing Employee -->
                                <div class="modal fade" id="myModal${employee.id}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                    <div class="modal-editPatients">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                                <h4 class="modal-title" id="myModalLabel">Редактирование сотрудника:</h4>
                                            </div>
                                            <div class="modal-body">

                                                <form name="editEmployee" action="/employees/edit" method="post">
                                                    <div class="col-lg-6 ">

                                                        <div class="form-group">
                                                            <input name="secondNameEdit" type="text" value="${employee.secondName}" class="form-control">
                                                        </div>
                                                        <div class="form-group">
                                                            <input name="firstNameEdit" type="text" value="${employee.firstName}" class="form-control">
                                                        </div>
                                                        <div class="form-group">
                                                            <input name="thirdNameEdit" type="text" value="${employee.thirdName}" class="form-control">
                                                        </div>

                                                        <a>Дата рождения:</a>

                                                        <div class="input-group date form-group">
                                                            <input name="dateEdit" type="text" class="form-control" value="${employee.birthday}"><span class="input-group-addon"><i
                                                                class="glyphicon glyphicon-th"></i></span>
                                                        </div>

                                                    </div>
                                                    <div class="col-lg-6">

                                                        <div class="form-group">
                                                            <textarea name="comments" rows="5" placeholder="Коментарии:" class="form-control"></textarea>
                                                        </div>
                                                    </div>
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Отмена</button>
                                                <input name="idEdit"  type="hidden" value="${employee.id}">
                                                <button type="submit" class="btn btn-primary">Редактировать</button>
                                                </form>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>${employee.id}</td>
                            <td>${employee.photo}</td>
                            <td>${employee.firstName}</td>
                            <td>${employee.secondName}</td>
                            <td>${employee.thirdName}</td>
                            <td>${employee.birthday}</td>
                            <td>${employee.phone}</td>
                            <td>${employee.email}</td>
                            <td>${employee.address}</td>
                        </tr>
                    </c:forEach>
                </table>
            </div>
        </div>
    </div>

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
