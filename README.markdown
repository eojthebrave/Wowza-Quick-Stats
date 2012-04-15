Basic node.js application to query a Wowza Streaming Media Server and collect basic statistics.

In order for this to work your WMS instance must have the connectioncount HTTP provider enabled and either open to the public or protected by admin-basic authentication. This application currently does not work with admin-digest authentication.

### Usage

Download/Clone this code.
Run setup.sh in order to download the necessary modules.

`sh setup.sh`

Once the required modules are installed you can execute the program as follows.

`chmod u+x wowza-stats.js`

`./wowza-stats.js --ur=http://wowza-server.example.com:8086/connectioncount`

### Options

--uri (required)
The URI of the connectioncount HTTP provider.

--repeat (optional)
If set the application will automatically repeat the stats check every --delay miliseconds.

--delay (optional) default 30000
Number of miliseconds to delay between repeats. Defaults to 30 seconds if not specified.

### Credits

@eojthebrave