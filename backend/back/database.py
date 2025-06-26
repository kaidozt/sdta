import mysql.connector
from mysql.connector import Error

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",  # asegúrate de que esté correcto
            database="db_radios"
        )
        if connection.is_connected():
            return connection
        else:
            raise Exception("La conexión no se pudo establecer.")
    except Error as e:
        print(f"ERROR DE CONEXIÓN A BASE DE DATOS: {e}")
        raise
