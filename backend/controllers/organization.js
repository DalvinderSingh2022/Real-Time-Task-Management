const Organization = require("../models/organization.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { sendMail } = require("../config/MailService");
const { registrationTemplate } = require("../emailTemplates");
const { getAvatar } = require("./user");

const createOrganization = async (req, res) => {
  const { name, email, password, orgName } = req.body;

  // Input validation
  if (
    !email?.trim() ||
    !password?.trim() ||
    !name?.trim() ||
    !orgName?.trim()
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    }).populate("orgId");
    if (existingUser) {
      return res.status(409).json({
        message: `This email is already registered under ${existingUser.orgId.name} (${existingUser.orgId.code}).`,
      });
    }

    // Check if organization already exists
    const existingOrg = await Organization.findOne({ name: orgName.trim() });
    if (existingOrg) {
      return res
        .status(409)
        .json({ message: "Organization name already taken" });
    }

    // Generate unique org code
    let orgCode;
    do {
      orgCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (await Organization.findOne({ code: orgCode }));

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = getAvatar(name.trim());

    // Create organization
    const organization = new Organization({
      name: orgName.trim(),
      code: orgCode,
    });

    await organization.save();

    // Create admin user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      avatar,
      password: hashedPassword,
      orgId: organization._id,
      isApproved: true,
      role: "admin",
    });

    await user.save();

    // Update organization with admin user id
    organization.adminUserId = user._id;
    await organization.save();

    // Send welcome email
    await sendMail({
      to: user.email,
      subject: "🎉 Organization Created - Welcome to Task Manager",
      html: registrationTemplate(user._id, user.name),
    });

    res.status(200).json({
      message: "Organization created successfully",
      organization,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const getOrganizationByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const organization = await Organization.findOne({
      code: code.toUpperCase(),
    });
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ organization });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  createOrganization,
  getOrganizationByCode,
};
