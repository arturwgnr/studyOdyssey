import { userRegister, userLogin } from "../services/auth.service.js";

export async function userLoginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields!" });
  }

  try {
    const token = await userLogin({ email, password });

    res.status(200).json({ message: "✔️ Login successfull", token });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export async function userRegisterController(req, res) {
  const { email, name, password } = req.body;

  if (!email || !password || !name) {
    return res.status(401).json({ message: "Missing fields!" });
  }

  try {
    const newUser = await userRegister({ email, name, password });

    res.status(201).json({ message: "✔️ User created", newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
