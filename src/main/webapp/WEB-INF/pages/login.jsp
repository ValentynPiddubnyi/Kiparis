<%--
  Created by IntelliJ IDEA.
  User: fil
  Date: 4/4/14
  Time: 12:54 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Регистрация</title>
    <!-- Custom styles for this template -->
    <link href="/Layouts/login.css" rel="stylesheet">
    <link href="/bootstrap-3.1.1-dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body onload='document.f.j_username.focus();'>

<div class="container">
    <form name="f" action="<c:url value='/j_spring_security_check' />" method="post" class="form-signin" role="form">
        <c:if test="${not empty error}">
            <div class="errorblock" style="color: red">
                Не удачная регистрация, попробуйте еще раз.<br/> Причмна :
                    ${sessionScope["SPRING_SECURITY_LAST_EXCEPTION"].message}
            </div>
        </c:if>
        <h4 class="form-signin-heading">Пожалуйста, зарегестрируйтесь:</h4>
        <input type="text" name='j_username' class="form-control" placeholder="Логин" required autofocus>
        <input type="password" name='j_password' class="form-control" placeholder="Пароль" required>
        <label class="checkbox">
            <input type="checkbox" value="remember-me"> Remember me
        </label>
        <button name="submit" class="btn btn-lg btn-primary btn-block" type="submit">Войти</button>
    </form>

</div>
</body>
</html>
