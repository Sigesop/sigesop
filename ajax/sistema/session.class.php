<?php

class session {
    private $conexion;
    private $host = 'localhost';
    private $user = '__session';
    private $password = '162bed2fa894a934c3120893c9332c51cc4a5f43';
    private $db = 'laventa_cfe';

    public function __construct ()
    {
        $this->conexion = new mysqli( $this->host, $this->user, $this->password, $this->db );

        session_set_save_handler(
            array( $this, "sess_open" ),
            array( $this, "sess_close" ),
            array( $this, "sess_read" ),
            array( $this, "sess_write" ),
            array( $this, "sess_destroy" ),
            array( $this, "sess_gc" )
        );
        session_start();
    }

    public function sess_open($sess_path, $sess_name) 
    {
        return true;
    }

    public function sess_close() 
    {
        return true;
    }

    public function sess_read($sess_id) 
    {
        $result = $this->conexion->query("SELECT Data FROM sessions WHERE SessionID = '$sess_id'");
        $CurrentTime = time();
        
        if ( !$this->conexion->affected_rows ) {            
            $this->conexion->query("INSERT INTO sessions (SessionID, DateTouched) VALUES ('$sess_id', $CurrentTime)");
            return '';
        } else {
            extract( $result->fetch_array(), EXTR_PREFIX_ALL, 'sess');
            $this->conexion->query("UPDATE sessions SET DateTouched = $CurrentTime WHERE SessionID = '$sess_id'");
            return $sess_Data;
        }
    }

    public function sess_write($sess_id, $data) 
    {
        $CurrentTime = time();
        $this->conexion->query("UPDATE sessions SET Data = '$data', DateTouched = $CurrentTime WHERE SessionID = '$sess_id'");
        return true;
    }

    public function sess_destroy($sess_id) 
    {
        $this->conexion->query("DELETE FROM sessions WHERE SessionID = '$sess_id'");
        return true;
    }

    public function sess_gc($sess_maxlifetime) 
    {
        $CurrentTime = time();
        $this->conexion->query("DELETE FROM sessions WHERE DateTouched + $sess_maxlifetime < $CurrentTime");
        return true;
    }
}