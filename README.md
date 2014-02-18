## Usability

#### Plugin for Redmine

Plugin that greatly improves usablity of Redmine.
It implements a lof of things that made Redmine interface user-friendly.

Plugin implements menu-item "Projects" in main menu as a pop-up menu with quick access to project actions.
Also plugin implements menu-item "Username" in main menu as a pop-up menu with quick access to account settings and "Appearance and usability" settings.
In "Appearance and usability" settings you can choose a method of opening pop-up menu in main menu: by mouseclick or mouseover.
Also plugin moves "Search" to main-menu and made it expandable.

![Interface](https://github.com/tdvsdv/usability/raw/master/screenshots/interface.png "Interface")![Interface2](https://github.com/tdvsdv/usability/raw/master/screenshots/interface2.png "Interface2")
![Interface3](https://github.com/tdvsdv/usability/raw/master/screenshots/interface3.png "Interface3")

===========

Plugin implements a new entity "Favourite project".
You can specify project as Favourite in your account settings. 
Favourite project will be marked with a star in projects list and in project menu you will have quick access to your favourite project tabs (New issue, Issues, Wiki).

![Interface4](https://github.com/tdvsdv/usability/raw/master/screenshots/interface4.png "Interface4")![Interface5](https://github.com/tdvsdv/usability/raw/master/screenshots/interface5.png "Interface5")

===========

Plugin implements a functionality of changing standart "Help" menu-item to a custom link.

![Settings](https://github.com/tdvsdv/usability/raw/master/screenshots/settings.png "Settings")

==========
[skin]: https://github.com/tdvsdv/redmine_alex_skin.git
[common_libs]: https://github.com/dkuk/a_common_libs
Attention! Plugin "Usability" requires plugin ["a_common_libs"][common_libs] and skin [Redmine Alex Skin][skin] to correct work. 


=========

#### Installation
To install plugin, go to the folder "plugins" in root directory of Redmine.
Clone plugins in that folder.

		git clone https://github.com/tdvsdv/usability.git
		git clone https://github.com/dkuk/a_common_libs.git

To install skin, go to the folder "../public/themes" in root directory of Redmine.
Clone skin in that folder.

		git clone https://github.com/tdvsdv/redmine_alex_skin.git

Perform plugin migrations (make sure performing command in the root installation folder of «Redmine»):

		rake redmine:plugins:migrate NAME=usability

Restart your web-server.

Go to the «A common libs» plugin settings and make sure that library «Bootstrap» is enabled.
Go to Redmine settings, tab "Display" and change theme to "Redmine alex skin".

#### Supported Redmine, Ruby and Rails versions.

Plugin aims to support and is tested under the following Redmine implementations:
* Redmine 2.3.1
* Redmine 2.3.2
* Redmine 2.3.3

Plugin aims to support and is tested under the following Ruby implementations:
* Ruby 1.9.2
* Ruby 1.9.3
* Ruby 2.0.0

Plugin aims to support and is tested under the following Rails implementations:
* Rails 3.2.13

#### Copyright
Copyright (c) 2011-2013 Vladimir Pitin, Danil Kukhlevskiy.

Another plugins of our team you can see on site http://rmplus.pro
