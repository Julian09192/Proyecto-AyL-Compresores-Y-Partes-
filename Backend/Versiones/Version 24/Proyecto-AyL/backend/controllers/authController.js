import db from "../config/db.js";

// 1. Verificar si un email existe en la tabla usuario
export const checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ exists: false, error: "Email requerido" });

  try {
    // Sintaxis Supabase: busca en la tabla 'usuario' donde 'correo' sea igual al email
    const { data, error } = await db
      .from("usuario")
      .select("id, correo")
      .eq("correo", email.trim().toLowerCase());

    if (error) throw error;

    const exists = data.length > 0;
    res.json({ 
      exists, 
      email,
      message: exists ? "Email encontrado" : "Email no registrado" 
    });
  } catch (err) {
    console.error("Error verificando email:", err);
    res.status(500).json({ exists: false, error: err.message });
  }
};

// 2. Sincronizar usuario de Supabase Auth con tu tabla real 'usuario'
export const syncUser = async (req, res) => {
  const { email, nombre, id } = req.body;
  if (!email || !id) return res.status(400).json({ success: false, error: "Email e ID son requeridos" });

  try {
    // Buscamos si ya existe por ID o Correo
    const { data: existente, error: errSearch } = await db
      .from("usuario")
      .select("id, nombre, correo, rol")
      .or(`id.eq.${id},correo.eq.${email}`);

    if (errSearch) throw errSearch;

    if (!existente || existente.length === 0) {
      // Si no existe, lo insertamos con la sintaxis nativa de Supabase
      const nombreUsuario = nombre || email.split('@')[0];
      
      const { data: nuevoUsuario, error: errInsert } = await db
        .from("usuario")
        .insert([
          { 
            id: id, 
            nombre: nombreUsuario, 
            correo: email, 
            rol: "cliente", 
            suspendido: false 
          }
        ])
        .select(); // El .select() al final actúa como el RETURNING * de SQL

      if (errInsert) throw errInsert;

      const user = nuevoUsuario[0];
      return res.json({ 
        success: true, 
        usuario: { id: user.id, nombre: user.nombre, email: user.correo, rol: user.rol } 
      });
    } else {
      // Si ya existía, retornamos el usuario encontrado
      const user = existente[0];
      return res.json({ 
        success: true, 
        usuario: { id: user.id, nombre: user.nombre, email: user.correo, rol: user.rol } 
      });
    }
  } catch (err) {
    console.error("Error en syncUser:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Registrar un nuevo usuario en Supabase Auth e insertarlo en la tabla 'usuario'
export const signUpUser = async (req, res) => {
  const { email, password, nombre } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email y contraseña son requeridos" });
  }

  try {
    // A) Creamos el usuario en el módulo de Autenticación de Supabase
    const { data: authData, error: authError } = await db.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        // Guardamos el nombre en los metadatos de Supabase Auth por seguridad
        data: { display_name: nombre } 
      }
    });

    if (authError) throw authError;

    // Si Supabase creó el usuario, extraemos su ID único
    const authUser = authData?.user;
    
    if (!authUser) {
      throw new Error("No se pudo crear el usuario en el servicio de autenticación.");
    }

    // B) Lo insertamos inmediatamente en tu tabla personalizada 'usuario'
    const nombreUsuario = nombre || email.split('@')[0];

    const { data: nuevoUsuario, error: errInsert } = await db
      .from("usuario")
      .insert([
        { 
          id: authUser.id, // Vinculamos el ID exacto de la autenticación
          nombre: nombreUsuario, 
          correo: email.trim().toLowerCase(), 
          rol: "cliente", 
          suspendido: false 
        }
      ])
      .select();

    if (errInsert) throw errInsert;

    // C) Respuesta exitosa
    return res.status(201).json({
      success: true,
      message: "Usuario registrado con éxito",
      usuario: {
        id: authUser.id,
        nombre: nombreUsuario,
        email: email
      }
    });

  } catch (err) {
    console.error("Error en signUpUser:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};